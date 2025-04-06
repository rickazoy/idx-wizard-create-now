
import { safeLocalStorage } from './browserUtils';
import { getConfigValue, setConfigValue } from './configStorage';

/**
 * Functions for API key management
 */

// Generate a random API key
export const generateApiKey = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 32;
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};

// Check if an API key exists
export const hasApiKey = (): boolean => {
  const key = getConfigValue('api_key');
  return key !== null && key.length > 0;
};

// Save API key
export const saveApiKey = (key: string): void => {
  setConfigValue('api_key', key);
};

// Validate API key format (simple check)
export const isValidApiKey = (key: string): boolean => {
  return key.length >= 24;
};

// Get API key
export const getApiKey = (): string | null => {
  return getConfigValue('api_key');
};
