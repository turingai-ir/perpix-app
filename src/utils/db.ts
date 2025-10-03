import { openDB, type IDBPDatabase } from 'idb';

import { APP_KEYS } from './app-keys';

type StorageName = (typeof APP_KEYS.DB.STORGES)[keyof typeof APP_KEYS.DB.STORGES];

export const getDB = async (storageName: StorageName): Promise<IDBPDatabase> => {
  return openDB(APP_KEYS.DB.NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(storageName)) {
        db.createObjectStore(storageName);
      }
    },
  });
};

export const saveAtom = async <T>(
  storageName: StorageName,
  key: string,
  value: T,
): Promise<void> => {
  try {
    const db = await getDB(storageName);
    await db.put(storageName, value, key);
  } catch (error) {
    console.error(`[IndexedDB] Failed to save key "${key}":`, error);
  }
};

export const loadAtom = async <T>(
  storageName: StorageName,
  key: string,
): Promise<T | undefined> => {
  try {
    const db = await getDB(storageName);
    return await db.get(storageName, key);
  } catch (error) {
    console.error(`[IndexedDB] Failed to load key "${key}":`, error);
    return undefined;
  }
};

export const deleteAtom = async (storageName: StorageName, key: string): Promise<void> => {
  try {
    const db = await getDB(storageName);
    await db.delete(storageName, key);
  } catch (error) {
    console.error(`[IndexedDB] Failed to delete key "${key}":`, error);
  }
};
