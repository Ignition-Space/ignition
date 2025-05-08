/* eslint-disable @typescript-eslint/no-explicit-any */
// Storage utility functions

type StorageType = 'session' | 'local';

const defaultStorageType: StorageType = 'local';

const defaultExpiryInMinutes = 60 * 24 * 7;

const getStorage = (type: StorageType = defaultStorageType): Storage | null => {
  if (typeof window === 'undefined') return null;
  return type === 'session' ? window.sessionStorage : window.localStorage;
};

/**
 * Set a value in Storage
 * @param key The key to set
 * @param value The value to store
 * @param type The storage type ('session' or 'local')
 * @param expiryInMinutes The expiry time in minutes
 */
export const setStorageItem = (
  key: string,
  value: any,
  type: StorageType = defaultStorageType,
  expiryInMinutes: number = defaultExpiryInMinutes,
): void => {
  try {
    const storage = getStorage(type);
    if (!storage) return;

    const serializedValue = JSON.stringify(value);
    const item = {
      value: serializedValue,
      expiry: expiryInMinutes ? Date.now() + expiryInMinutes * 60 * 1000 : null,
    };
    storage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error(`Error setting ${type} storage item:`, error);
  }
};

/**
 * Get a value from Storage
 * @param key The key to retrieve
 * @param type The storage type ('session' or 'local')
 * @returns The stored value or null if not found
 */
export const getStorageItem = (
  key: string,
  type: StorageType = defaultStorageType,
): any | null => {
  try {
    const storage = getStorage(type);
    if (!storage) return null;

    const serializedValue = storage.getItem(key);
    if (serializedValue) {
      const item = JSON.parse(serializedValue);
      if (item.expiry && Date.now() > item.expiry) {
        removeStorageItem(key, type);
        return null;
      }
      return JSON.parse(item.value);
    }
    return null;
  } catch (error) {
    console.error(`Error getting ${type} storage item:`, error);
    return null;
  }
};

/**
 * Remove an item from Storage
 * @param key The key to remove
 * @param type The storage type ('session' or 'local')
 */
export const removeStorageItem = (
  key: string,
  type: StorageType = defaultStorageType,
): void => {
  try {
    const storage = getStorage(type);
    if (!storage) return;

    storage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${type} storage item:`, error);
  }
};

/**
 * Update a value in Storage
 * @param key The key to update
 * @param value The new value to store
 * @param type The storage type ('session' or 'local')
 * @param expiryInMinutes The expiry time in minutes
 * @returns true if updated successfully, false otherwise
 */
export const updateStorageItem = (
  key: string,
  value: any,
  type: StorageType = defaultStorageType,
  expiryInMinutes: number = defaultExpiryInMinutes,
): boolean => {
  try {
    const storage = getStorage(type);
    if (!storage) return false;

    if (storage.getItem(key) !== null) {
      setStorageItem(key, value, type, expiryInMinutes);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error updating ${type} storage item:`, error);
    return false;
  }
};

/**
 * Clear all items from Storage
 * @param type The storage type ('session' or 'local')
 */
export const clearStorage = (type: StorageType = defaultStorageType): void => {
  try {
    const storage = getStorage(type);
    if (!storage) return;

    storage.clear();
  } catch (error) {
    console.error(`Error clearing ${type} storage:`, error);
  }
};
