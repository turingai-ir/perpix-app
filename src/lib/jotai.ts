import { createStore } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import type { SyncStorage } from 'jotai/vanilla/utils/atomWithStorage';

import { LocalStorageAdapter, type WebStorage } from './web-storage';

type AtomConfig<T = any> = {
  atom: ReturnType<typeof atomWithStorage<T>>;
  key: string;
  defaultValue: T;
  storage: SyncStorage<T>;
};

const atomConfigs = new Map<string, AtomConfig>();

// Cache برای storage instances تا duplicate creation جلوگیری بشه
const storageCache = new WeakMap<WebStorage, SyncStorage<any>>();

const getDefaultStorage = <Value>(): SyncStorage<Value> => {
  const defaultAdapter = new LocalStorageAdapter();
  if (!storageCache.has(defaultAdapter)) {
    storageCache.set(defaultAdapter, createSyncJotaiStorage(defaultAdapter));
  }
  return storageCache.get(defaultAdapter)! as SyncStorage<Value>;
};

export const createSyncJotaiStorage = <Value>(storage: WebStorage = new LocalStorageAdapter()) => {
  if (storageCache.has(storage)) {
    return storageCache.get(storage)! as SyncStorage<Value>;
  }

  const jotaiStorage = createJSONStorage<Value>(() => ({
    getItem(key: string) {
      try {
        return storage.get(key) as string | null;
        // eslint-disable-next-line unused-imports/no-unused-vars
      } catch (e) {
        return null;
      }
    },
    removeItem(key: string) {
      try {
        storage.delete(key);
      } catch (e) {
        /* empty */
      }
    },
    setItem(key: string, newValue: string) {
      try {
        storage.set(key, newValue);
      } catch (e) {
        /* empty */
      }
    },
  }));

  storageCache.set(storage, jotaiStorage);
  return jotaiStorage;
};

function isObject(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function shallowMerge<T>(target: T, source: T): T {
  if (!isObject(target) || !isObject(source)) {
    return source;
  }
  return { ...target, ...source } as T;
}

export function bootstrapJotai() {
  const store = createStore();

  for (const [key, config] of atomConfigs) {
    try {
      const storedValue = config.storage.getItem(key, config.defaultValue);

      if (storedValue === null || storedValue === undefined) {
        store.set(config.atom, config.defaultValue);
        atomConfigs.delete(key); // بلافاصله delete برای کاهش memory
        continue;
      }

      if (isObject(config.defaultValue) && isObject(storedValue)) {
        const mergedValue = shallowMerge(config.defaultValue, storedValue);
        store.set(config.atom, mergedValue);
      } else {
        store.set(config.atom, storedValue);
      }
    } catch (e) {
      store.set(config.atom, config.defaultValue);
    }
    atomConfigs.delete(key);
  }

  return store;
}

export const atomWithSyncStorage = <Value>(
  key: string,
  defaultValue: Value,
  storage: SyncStorage<Value> = getDefaultStorage<Value>(),
): ReturnType<typeof atomWithStorage<Value>> => {
  if (atomConfigs.has(key)) {
    return atomConfigs.get(key)!.atom;
  }

  const storageAtom = atomWithStorage(key, defaultValue, storage, {
    getOnInit: false,
  });

  atomConfigs.set(key, {
    atom: storageAtom,
    key,
    defaultValue,
    storage,
  });

  return storageAtom;
};

export const unregisterAtom = (key: string) => {
  atomConfigs.delete(key);
};
