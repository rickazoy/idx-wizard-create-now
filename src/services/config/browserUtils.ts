
/**
 * Utility functions for browser environment detection
 */

// Check if we're in a browser environment - defined safely for SSR
export const isBrowser = typeof globalThis !== 'undefined' && 
  typeof globalThis.document === 'object';

// Local storage access utilities
export const saveToLocalStorage = (key: string, value: string): void => {
  if (isBrowser) {
    localStorage.setItem(key, value);
  }
};

export const getFromLocalStorage = (key: string): string | null => {
  if (isBrowser) {
    return localStorage.getItem(key);
  }
  return null;
};
