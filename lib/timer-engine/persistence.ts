/**
 * Safe LocalStorage Persistence with Schema Validation and Migration
 */

const STORAGE_VERSION = 1;

export interface StorageContainer<T> {
  version: number;
  updatedAt: number;
  data: T;
}

export function saveToStorage<T>(key: string, data: T): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const container: StorageContainer<T> = {
      version: STORAGE_VERSION,
      updatedAt: Date.now(),
      data,
    };
    localStorage.setItem(`chronos_${key}`, JSON.stringify(container));
    return true;
  } catch (err) {
    console.warn(`Failed to save to localStorage (${key}):`, err);
    return false;
  }
}

export function loadFromStorage<T>(
  key: string,
  defaultValue: T,
  validator?: (data: unknown) => data is T
): T {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const raw = localStorage.getItem(`chronos_${key}`);
    if (!raw) return defaultValue;

    const parsed = JSON.parse(raw) as StorageContainer<T>;
    if (!parsed || typeof parsed !== 'object') return defaultValue;

    // Check version
    if (parsed.version !== STORAGE_VERSION) {
      // In future, migrate schemas here
      return defaultValue;
    }

    if (validator) {
      return validator(parsed.data) ? parsed.data : defaultValue;
    }

    return parsed.data;
  } catch (err) {
    console.warn(`Failed to parse localStorage item (${key}):`, err);
    return defaultValue;
  }
}

export function removeFromStorage(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(`chronos_${key}`);
  } catch {
    // Ignore error
  }
}
