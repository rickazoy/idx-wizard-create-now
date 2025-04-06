
// API utility functions for the application
import { ConfigSettings } from './config';

/**
 * API Key management
 */
export const getApiKey = (): string => {
  return localStorage.getItem('api_key') || '';
};

export const setApiKey = (apiKey: string): void => {
  localStorage.setItem('api_key', apiKey);
};

export const validateApiKey = (apiKey: string): boolean => {
  const storedKey = getApiKey();
  
  // If no key is stored yet, consider this the first setup
  if (!storedKey && apiKey.length >= 24) {
    return true;
  }
  
  return storedKey === apiKey && apiKey.length >= 24;
};

/**
 * Process configuration update request for the REST API
 */
export const processConfigUpdate = async (
  configData: Partial<ConfigSettings>,
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
    // Store each configuration value
    Object.entries(configData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        localStorage.setItem(key, value.toString());
      }
    });
    
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
