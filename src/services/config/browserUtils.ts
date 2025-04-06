
/**
 * Utility functions for browser environment detection and operations
 */

// TypeScript-safe browser environment detection
const isBrowserEnv = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof document !== 'undefined' && 
         typeof localStorage !== 'undefined';
};

/**
 * Check if the code is running in a browser environment
 */
export const isBrowser = (): boolean => {
  return isBrowserEnv();
};

/**
 * Get the current URL in a browser-safe way
 */
export const getCurrentUrl = (): URL | null => {
  if (!isBrowserEnv()) {
    return null;
  }
  
  try {
    return new URL((window as Window).location.href);
  } catch (error) {
    console.error('Error parsing current URL:', error);
    return null;
  }
};

/**
 * Check if we're running in a secure context (HTTPS)
 */
export const isSecureContext = (): boolean => {
  if (!isBrowserEnv()) {
    return false;
  }
  
  return (window as Window).location.protocol === 'https:';
};

/**
 * Safely access browser's local storage
 */
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (!isBrowserEnv()) {
      return null;
    }
    try {
      return (localStorage as Storage).getItem(key);
    } catch (error) {
      console.error(`Error accessing localStorage for key ${key}:`, error);
      return null;
    }
  },
  
  setItem: (key: string, value: string): void => {
    if (!isBrowserEnv()) {
      return;
    }
    try {
      (localStorage as Storage).setItem(key, value);
    } catch (error) {
      console.error(`Error setting localStorage for key ${key}:`, error);
    }
  },
  
  removeItem: (key: string): void => {
    if (!isBrowserEnv()) {
      return;
    }
    try {
      (localStorage as Storage).removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage for key ${key}:`, error);
    }
  }
};
