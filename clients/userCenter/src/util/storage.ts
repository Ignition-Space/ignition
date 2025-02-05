/* eslint-disable @typescript-eslint/no-explicit-any */
// Storage utility functions

type StorageType = 'session' | 'local';

const defaultStorageType: StorageType = 'local';

const defaultExpiryInMinutes = 60 * 24 * 7;

const getStorage = (type: StorageType = defaultStorageType): Storage => {
  return type === 'session' ? sessionStorage : localStorage;
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
    const serializedValue = JSON.stringify(value);
    const item = {
      value: serializedValue,
      expiry: expiryInMinutes ? Date.now() + expiryInMinutes * 60 * 1000 : null,
    };
    getStorage(type).setItem(key, JSON.stringify(item));
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
  const serializedValue = getStorage(type).getItem(key);
  try {
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
    return serializedValue || null;
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
    getStorage(type).removeItem(key);
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
    if (getStorage(type).getItem(key) !== null) {
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
    getStorage(type).clear();
  } catch (error) {
    console.error(`Error clearing ${type} storage:`, error);
  }
};
