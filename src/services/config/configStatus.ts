
import { getConfigValue } from './configStorage';

/**
 * Functions to check configuration status
 */

// Check if API configuration is complete
export const isApiConfigured = (): boolean => {
  return !!getConfigValue('api_key');
};

// Check if IDX configuration is complete
export const isIdxConfigured = (): boolean => {
  return !!getConfigValue('idx_api_key');
};

// Check if Airtable configuration is complete
export const isAirtableConfigured = (): boolean => {
  return !!getConfigValue('airtable_api_key') && !!getConfigValue('airtable_base_id');
};
