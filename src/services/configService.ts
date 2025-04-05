/**
 * Configuration Service
 * Handles retrieving and setting configuration values from both localStorage and Airtable
 */

import { getBase } from './airtable/airtableCore';

export interface ConfigSettings {
  // IDX Settings
  idx_api_key: string;
  idx_output_type: string;
  idx_api_version: string;
  idx_ancillary_key?: string;
  
  // Airtable Settings
  airtable_api_key: string;
  airtable_base_id: string;
  airtable_agent_filter?: string;
  
  // Agent Settings
  agent_name: string;
  agent_bio: string;
  agent_photo: string;
  
  // Other Settings
  is_admin: string; // Changed from boolean to string since localStorage stores strings
}

// Airtable table name for configuration
const CONFIG_TABLE_NAME = 'Lovable';

/**
 * Get configuration value with fallback priorities:
 * 1. URL parameters (highest priority)
 * 2. Airtable config (if available)
 * 3. localStorage (always available as fallback)
 */
export async function getConfigValue(key: keyof ConfigSettings, tenantId?: string): Promise<string> {
  // First check URL parameters (highest priority)
  const urlParams = new URLSearchParams(window.location.search);
  const paramValue = urlParams.get(key);
  if (paramValue) {
    console.log(`[Config] Using URL parameter for ${key}`);
    return paramValue;
  }
  
  // Next, try to get from Airtable if tenantId is provided
  if (tenantId) {
    try {
      const airtableValue = await getConfigFromAirtable(key, tenantId);
      if (airtableValue) {
        console.log(`[Config] Using Airtable value for ${key}`);
        return airtableValue;
      }
    } catch (error) {
      console.warn(`[Config] Error fetching from Airtable for ${key}:`, error);
    }
  }
  
  // Finally, fall back to localStorage
  const localValue = localStorage.getItem(key) || '';
  console.log(`[Config] Using localStorage value for ${key}`);
  return localValue;
}

/**
 * Set configuration value in both localStorage and Airtable (if available)
 */
export async function setConfigValue(key: keyof ConfigSettings, value: string, tenantId?: string): Promise<boolean> {
  // Always update localStorage
  localStorage.setItem(key, value);
  
  // Update Airtable if tenantId is provided
  if (tenantId) {
    try {
      await updateAirtableConfig(key, value, tenantId);
      return true;
    } catch (error) {
      console.error(`[Config] Error updating Airtable for ${key}:`, error);
      return false;
    }
  }
  
  return true;
}

/**
 * Fetch configuration from Airtable by tenant ID
 */
async function getConfigFromAirtable(key: keyof ConfigSettings, tenantId: string): Promise<string> {
  const base = getBase();
  if (!base) throw new Error("Airtable base not initialized");
  
  try {
    const records = await base(CONFIG_TABLE_NAME)
      .select({
        filterByFormula: `{TenantID} = "${tenantId}"`,
        maxRecords: 1,
      })
      .firstPage();
      
    if (records.length === 0) {
      throw new Error(`No configuration found for tenant: ${tenantId}`);
    }
    
    // Map Airtable field names to our config keys
    const fieldMapping: Record<keyof ConfigSettings, string> = {
      idx_api_key: 'IDX API Key',
      idx_output_type: 'Output Type',
      idx_api_version: 'API Version',
      idx_ancillary_key: 'Ancillary Key',
      airtable_api_key: 'Airtable API Token',
      airtable_base_id: 'Base ID',
      airtable_agent_filter: 'Filter by Listing Agent',
      agent_name: 'Agent Name',
      agent_bio: 'Agent Bio',
      agent_photo: 'Agent Photo',
      is_admin: 'Is Admin',
    };
    
    const airtableField = fieldMapping[key];
    const value = records[0].get(airtableField) || '';
    return value.toString();
  } catch (error) {
    console.error('Error fetching config from Airtable:', error);
    throw error;
  }
}

/**
 * Update configuration in Airtable
 */
async function updateAirtableConfig(key: keyof ConfigSettings, value: string, tenantId: string): Promise<void> {
  const base = getBase();
  if (!base) throw new Error("Airtable base not initialized");
  
  try {
    // Find the record for this tenant
    const records = await base(CONFIG_TABLE_NAME)
      .select({
        filterByFormula: `{TenantID} = "${tenantId}"`,
        maxRecords: 1,
      })
      .firstPage();
    
    // Map config keys to Airtable field names
    const fieldMapping: Record<keyof ConfigSettings, string> = {
      idx_api_key: 'IDX API Key',
      idx_output_type: 'Output Type',
      idx_api_version: 'API Version',
      idx_ancillary_key: 'Ancillary Key',
      airtable_api_key: 'Airtable API Token',
      airtable_base_id: 'Base ID',
      airtable_agent_filter: 'Filter by Listing Agent',
      agent_name: 'Agent Name',
      agent_bio: 'Agent Bio',
      agent_photo: 'Agent Photo',
      is_admin: 'Is Admin',
    };
    
    const airtableField = fieldMapping[key];
    
    if (records.length > 0) {
      // Update existing record
      await base(CONFIG_TABLE_NAME).update(records[0].id, {
        [airtableField]: value,
      });
    } else {
      // Create new record for this tenant
      await base(CONFIG_TABLE_NAME).create({
        'TenantID': tenantId,
        [airtableField]: value,
      });
    }
  } catch (error) {
    console.error('Error updating config in Airtable:', error);
    throw error;
  }
}

/**
 * Get all configuration values for a tenant
 */
export async function getAllConfig(tenantId?: string): Promise<Partial<ConfigSettings>> {
  const config: Partial<ConfigSettings> = {};
  
  // Get all keys from localStorage first
  const keys: (keyof ConfigSettings)[] = [
    'idx_api_key',
    'idx_output_type',
    'idx_api_version',
    'idx_ancillary_key',
    'airtable_api_key',
    'airtable_base_id',
    'airtable_agent_filter',
    'agent_name',
    'agent_bio',
    'agent_photo',
    'is_admin',
  ];
  
  // For each key, get the value using our priority system
  for (const key of keys) {
    try {
      config[key] = await getConfigValue(key, tenantId);
    } catch (error) {
      console.warn(`Error getting config value for ${key}:`, error);
    }
  }
  
  return config;
}

/**
 * Initialize configuration from URL parameters and save to localStorage
 * This is useful for n8n deployments where config is passed via URL
 */
export function initConfigFromUrl(): void {
  const urlParams = new URLSearchParams(window.location.search);
  const tenantId = urlParams.get('tenantId');
  
  // Map URL parameters to localStorage
  const paramMap: Record<string, keyof ConfigSettings> = {
    idxApiKey: 'idx_api_key',
    outputType: 'idx_output_type',
    apiVersion: 'idx_api_version',
    ancillaryKey: 'idx_ancillary_key',
    airtableApiKey: 'airtable_api_key',
    baseId: 'airtable_base_id',
    agentFilter: 'airtable_agent_filter',
    agentName: 'agent_name',
    agentBio: 'agent_bio',
    agentPhoto: 'agent_photo',
    isAdmin: 'is_admin',
  };
  
  // Process each parameter and save to localStorage
  Object.entries(paramMap).forEach(([paramName, storageKey]) => {
    const value = urlParams.get(paramName);
    if (value) {
      localStorage.setItem(storageKey, value);
      console.log(`[Config] Initialized ${storageKey} from URL parameter`);
    }
  });
  
  // Save tenant ID if provided
  if (tenantId) {
    localStorage.setItem('tenantId', tenantId);
    console.log(`[Config] Tenant ID set to ${tenantId}`);
  }
}
