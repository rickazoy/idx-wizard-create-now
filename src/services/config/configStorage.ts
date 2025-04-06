
import { ConfigSettings } from './types';
import { isBrowser, safeLocalStorage } from './browserUtils';

/**
 * Core configuration storage and retrieval functions
 */

// Get a configuration value
export const getConfigValue = (key: keyof ConfigSettings): string | null => {
  if (!isBrowser()) return null;
  return safeLocalStorage.getItem(key) || null;
};

// Set a configuration value
export const setConfigValue = (key: keyof ConfigSettings, value: string): void => {
  if (!isBrowser()) return;
  safeLocalStorage.setItem(key, value);
};

// Clear a configuration value
export const clearConfigValue = (key: keyof ConfigSettings): void => {
  if (!isBrowser()) return;
  safeLocalStorage.removeItem(key);
};

// Export configuration as JSON
export const exportConfig = (): ConfigSettings => {
  return {
    idx_api_key: getConfigValue('idx_api_key') || undefined,
    idx_api_version: getConfigValue('idx_api_version') || undefined,
    idx_ancillary_key: getConfigValue('idx_ancillary_key') || undefined,
    airtable_api_key: getConfigValue('airtable_api_key') || undefined,
    airtable_base_id: getConfigValue('airtable_base_id') || undefined,
    airtable_agent_filter: getConfigValue('airtable_agent_filter') || undefined,
    api_key: getConfigValue('api_key') || undefined
  };
};

// Import configuration from JSON
export const importConfig = (config: Partial<ConfigSettings>): void => {
  if (config.idx_api_key) setConfigValue('idx_api_key', config.idx_api_key);
  if (config.idx_api_version) setConfigValue('idx_api_version', config.idx_api_version);
  if (config.idx_ancillary_key) setConfigValue('idx_ancillary_key', config.idx_ancillary_key);
  if (config.airtable_api_key) setConfigValue('airtable_api_key', config.airtable_api_key);
  if (config.airtable_base_id) setConfigValue('airtable_base_id', config.airtable_base_id);
  if (config.airtable_agent_filter) setConfigValue('airtable_agent_filter', config.airtable_agent_filter);
  if (config.api_key) setConfigValue('api_key', config.api_key);
};
