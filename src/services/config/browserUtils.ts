
/**
 * Utility functions for browser environment detection and operations
 */

// Add type declarations for browser environment
declare const window: Window & typeof globalThis;
declare const document: Document;
declare const localStorage: Storage;

/**
 * Check if the code is running in a browser environment
 */
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && 
    typeof document !== 'undefined' && 
    typeof localStorage !== 'undefined';
};

/**
 * Get the current URL in a browser-safe way
 */
export const getCurrentUrl = (): URL | null => {
  if (!isBrowser()) {
    return null;
  }
  
  try {
    return new URL(window.location?.href || '');
  } catch (error) {
    console.error('Error parsing current URL:', error);
    return null;
  }
};

/**
 * Check if we're running in a secure context (HTTPS)
 */
export const isSecureContext = (): boolean => {
  if (!isBrowser()) {
    return false;
  }
  
  return window.location?.protocol === 'https:';
};

/**
 * Safely access browser's local storage
 */
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (!isBrowser()) {
      return null;
    }
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error accessing localStorage for key ${key}:`, error);
      return null;
    }
  },
  
  setItem: (key: string, value: string): void => {
    if (!isBrowser()) {
      return;
    }
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting localStorage for key ${key}:`, error);
    }
  },
  
  removeItem: (key: string): void => {
    if (!isBrowser()) {
      return;
    }
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage for key ${key}:`, error);
    }
  }
};
