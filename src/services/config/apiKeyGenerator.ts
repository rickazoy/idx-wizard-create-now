
import { isBrowser } from './browserUtils';

/**
 * Functions for API key generation and management
 */

// Generate a new API key
export const generateApiKey = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 32;
  let result = '';
  
  if (isBrowser && (globalThis as any).crypto) {
    // Safely access the crypto object when we know we're in a browser
    const randomValues = new Uint8Array(length);
    (globalThis as any).crypto.getRandomValues(randomValues);
    
    for (let i = 0; i < length; i++) {
      result += characters.charAt(randomValues[i] % characters.length);
    }
  } else {
    // Fallback for non-browser environments
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  }
  
  return result;
};
