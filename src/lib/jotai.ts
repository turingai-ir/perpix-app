import { del, entries, get, set as idbSet } from 'idb-keyval';
import { type WritableAtom, createStore } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import type { SyncStorage } from 'jotai/vanilla/utils/atomWithStorage';

import { LocalStorageAdapter, type WebStorage } from './web-storage';

// ============ Types ============
type MergeStrategy = 'merge' | 'replace';

type AtomConfig<T = any> = {
  atom: WritableAtom<T, [T], void>;
  key: string;
  version: number;
  defaultValue: T;
  strategy: MergeStrategy;
};

type AtomWithStorageOptions = {
  strategy?: MergeStrategy;
  version?: number;
};

type CreateSyncJotaiStorageOptions = {
  debugging?: boolean;
};

type WriteOperation = {
  key: string;
  value: string;
};

type LoadResult = {
  value: unknown;
  writes: WriteOperation[];
  needsCleanup: boolean;
};

// ============ Storage ============
const atomConfigs: AtomConfig[] = [];
const registeredKeys = new Set<string>();
let isBootstrapped = false;

export const createSyncJotaiStorage = <Value>(
  storage: WebStorage = new LocalStorageAdapter(),
  options?: CreateSyncJotaiStorageOptions,
) =>
  createJSONStorage<Value>(() => ({
    getItem(key) {
      try {
        return storage.get(key) as string | null;
      } catch (e) {
        if (options?.debugging) {
          // eslint-disable-next-line no-console
          console.error('Failed to get item from storage:', key, e);
        }
        return null;
      }
    },
    removeItem(key) {
      try {
        storage.delete(key);
      } catch (e) {
        if (options?.debugging) {
          // eslint-disable-next-line no-console
          console.error('Failed to remove item from storage:', key, e);
        }
      }
    },
    setItem(key, newValue) {
      try {
        storage.set(key, newValue);
      } catch (e) {
        if (options?.debugging) {
          // eslint-disable-next-line no-console
          console.error('Failed to set item in storage:', key, e);
        }
      }
    },
  }));

// ============ Utilities ============
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && value.constructor === Object;
}

function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  if (!isPlainObject(source)) {
    return target;
  }

  const result = { ...target };

  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = target[key];

    // Preserve null explicitly
    if (sourceValue === null) {
      result[key] = null as T[Extract<keyof T, string>];
      continue;
    }

    // Skip undefined
    if (sourceValue === undefined) {
      continue;
    }

    // Recursively merge nested objects
    if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
      result[key] = deepMerge(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>,
      ) as T[Extract<keyof T, string>];
    } else {
      result[key] = sourceValue as T[Extract<keyof T, string>];
    }
  }

  return result;
}

function getVersionKey(key: string): string {
  return `${key}_version`;
}

async function cleanupOldVersions(key: string): Promise<void> {
  try {
    const allEntries = await entries();
    const prefix = `${key}_v`;
    const keysToDelete: string[] = [];

    for (const [storageKey] of allEntries) {
      if (typeof storageKey !== 'string') {
        continue;
      }

      if (storageKey.startsWith(prefix)) {
        const suffix = storageKey.slice(prefix.length);
        if (/^\d+$/.test(suffix)) {
          keysToDelete.push(storageKey);
        }
      }
    }

    if (keysToDelete.length > 0) {
      await Promise.all(keysToDelete.map((key) => del(key)));
    }
    // eslint-disable-next-line unused-imports/no-unused-vars
  } catch (e) {
    // Silent fail - cleanup is not critical
  }
}

// ============ Core Logic ============
async function loadAtomConfig(config: AtomConfig): Promise<LoadResult> {
  const { key, version, defaultValue, strategy } = config;
  const versionKey = getVersionKey(key);

  // Batch read
  const [storedVersion, storedData] = await Promise.all([get(versionKey), get(key)]);

  // First time - save defaults
  if (!storedData) {
    return {
      value: defaultValue,
      writes: [
        { key: versionKey, value: String(version) },
        { key, value: JSON.stringify(defaultValue) },
      ],
      needsCleanup: false,
    };
  }

  // Parse stored data
  let parsedData: unknown;
  try {
    parsedData = JSON.parse(storedData as string);
  } catch {
    // Invalid data - reset to defaults
    return {
      value: defaultValue,
      writes: [
        { key: versionKey, value: String(version) },
        { key, value: JSON.stringify(defaultValue) },
      ],
      needsCleanup: false,
    };
  }

  const currentVersion = storedVersion ? parseInt(String(storedVersion), 10) : 1;
  const needsMigration = currentVersion !== version;

  // Handle migration
  if (needsMigration) {
    const migratedValue =
      strategy === 'merge' && isPlainObject(defaultValue) && isPlainObject(parsedData)
        ? deepMerge(defaultValue as Record<string, unknown>, parsedData as Record<string, unknown>)
        : defaultValue;

    return {
      value: migratedValue,
      writes: [
        { key: versionKey, value: String(version) },
        { key, value: JSON.stringify(migratedValue) },
      ],
      needsCleanup: true,
    };
  }

  // Same version - still merge to add new keys
  if (strategy === 'merge') {
    const mergedValue =
      isPlainObject(defaultValue) && isPlainObject(parsedData)
        ? deepMerge(defaultValue as Record<string, unknown>, parsedData as Record<string, unknown>)
        : parsedData;
    const mergedString = JSON.stringify(mergedValue);

    // Only write if changed
    if (mergedString !== storedData) {
      return {
        value: mergedValue,
        writes: [{ key, value: mergedString }],
        needsCleanup: false,
      };
    }

    return {
      value: mergedValue,
      writes: [],
      needsCleanup: false,
    };
  }

  // Replace strategy - use stored data as-is
  return {
    value: parsedData,
    writes: [],
    needsCleanup: false,
  };
}

export async function bootstrapJotai() {
  if (isBootstrapped) {
    // do some log
  }

  const store = createStore();
  // Load all atoms
  const loadResults = await Promise.all(atomConfigs.map((config) => loadAtomConfig(config)));

  // Batch write all changes
  const allWrites = loadResults.flatMap((result) => result.writes);
  if (allWrites.length > 0) {
    await Promise.all(allWrites.map(({ key, value }) => idbSet(key, value)));
  }

  // Set atom values
  atomConfigs.forEach((config, index) => {
    store.set(config.atom, loadResults[index].value);
  });

  // Cleanup old versions (async, non-blocking)
  const keysNeedingCleanup = atomConfigs
    .filter((_, index) => loadResults[index].needsCleanup)
    .map((config) => config.key);

  if (keysNeedingCleanup.length > 0) {
    Promise.all(keysNeedingCleanup.map((key) => cleanupOldVersions(key)));
  }

  isBootstrapped = true;
  return store;
}

export const atomWithSyncStorage = <Value>(
  key: string,
  defaultValue: Value,
  storage: SyncStorage<Value> = createSyncJotaiStorage(),
  options?: AtomWithStorageOptions,
) => {
  // Prevent duplicate registration
  if (registeredKeys.has(key)) {
    // do some logs
    const existing = atomConfigs.find((c) => c.key === key);
    if (existing) {
      return existing.atom as ReturnType<typeof atomWithStorage<Value>>;
    }
  }

  const storageAtom = atomWithStorage(key, defaultValue, storage, {
    getOnInit: false,
  });

  atomConfigs.push({
    atom: storageAtom,
    key,
    version: options?.version ?? 1,
    defaultValue,
    strategy: options?.strategy ?? 'merge',
  });

  registeredKeys.add(key);

  return storageAtom;
};

// ============ Testing Utilities ============
export function resetJotaiBootstrap(): void {
  atomConfigs.length = 0;
  registeredKeys.clear();
  isBootstrapped = false;
}
