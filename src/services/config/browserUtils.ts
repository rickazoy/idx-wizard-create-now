
/**
 * Utility functions for browser environment detection and operations
 */

// Define global types for browser environment
declare global {
  interface Window {
    location: Location;
  }

  // Use DOM lib types instead of redefining Location
  // interface Location {
  //   href: string;
  //   protocol: string;
  //   origin: string;
  //   pathname: string;
  // }

  // No need to re-declare Document
  // interface Document {}

  // No need to re-declare Storage
  // interface Storage {
  //   getItem(key: string): string | null;
  //   setItem(key: string, value: string): void;
  //   removeItem(key: string): void;
  // }
}

const isBrowserEnv = typeof window !== 'undefined' && 
  typeof document !== 'undefined' && 
  typeof localStorage !== 'undefined';

/**
 * Check if the code is running in a browser environment
 */
export const isBrowser = (): boolean => {
  return isBrowserEnv;
};

/**
 * Get the current URL in a browser-safe way
 */
export const getCurrentUrl = (): URL | null => {
  if (!isBrowserEnv) {
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
  if (!isBrowserEnv) {
    return false;
  }
  
  return window.location?.protocol === 'https:';
};

/**
 * Safely access browser's local storage
 */
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (!isBrowserEnv) {
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
    if (!isBrowserEnv) {
      return;
    }
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting localStorage for key ${key}:`, error);
    }
  },
  
  removeItem: (key: string): void => {
    if (!isBrowserEnv) {
      return;
    }
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage for key ${key}:`, error);
    }
  }
};
