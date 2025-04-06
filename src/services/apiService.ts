
import { ConfigSettings, setConfigValue } from './configService';

// API key stored in localStorage (for demo purposes)
// In production, this should be stored securely
const API_KEY_STORAGE_KEY = 'lovable_api_key';

// Check if we're in a browser environment - defined safely for SSR
const isBrowser = typeof globalThis !== 'undefined' && !!globalThis.document;

/**
 * Check if the provided API key is valid
 */
export const validateApiKey = (providedApiKey: string): boolean => {
  if (!isBrowser) return false;
  
  const storedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  
  // If no API key is set, authentication fails
  if (!storedApiKey) return false;
  
  return providedApiKey === storedApiKey;
};

/**
 * Set or update the API key
 */
export const setApiKey = (newApiKey: string): void => {
  if (!isBrowser) return;
  localStorage.setItem(API_KEY_STORAGE_KEY, newApiKey);
};

/**
 * Get the current API key
 */
export const getApiKey = (): string => {
  if (!isBrowser) return '';
  return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
};

/**
 * Process a configuration update from the API
 */
export const processConfigUpdate = async (
  data: Partial<ConfigSettings>, 
  apiKey: string
): Promise<{ success: boolean; message: string }> => {
  // Validate the API key
  if (!validateApiKey(apiKey)) {
    return { 
      success: false, 
      message: 'Invalid API key' 
    };
  }
  
  try {
    // Update each configuration value
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null) {
        // Make sure key is a valid ConfigSettings key
        const configKey = key as keyof ConfigSettings;
        setConfigValue(configKey, String(value));
      }
    }
    
    return { 
      success: true, 
      message: 'Configuration updated successfully' 
    };
  } catch (error) {
    console.error('Error processing config update:', error);
    return { 
      success: false, 
      message: `Error updating configuration: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
};
