
import { toast } from 'sonner';

// Define configuration settings types
export interface ConfigSettings {
  idx_api_key?: string;
  idx_api_version?: string; 
  idx_ancillary_key?: string;
  idx_output_type?: string;
  api_version?: string;
  ancillary_key?: string;
  airtable_api_key?: string;
  airtable_base_id?: string;
  airtable_agent_filter?: string;
  agent_filter?: string;
  api_key?: string;
  agent_name?: string;
  agent_bio?: string;
  agent_photo?: string;
  agent_phone?: string;
  agent_email?: string;
  agent_license?: string;
}

/**
 * Initialize configuration from URL parameters
 * This allows headless setup of the application via URL
 */
export const initConfigFromUrl = () => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;
    
    const url = new URL(window.location.href);
    const params = url.searchParams;
    
    // Check for API key parameter
    const apiKey = params.get('api_key');
    if (apiKey) {
      localStorage.setItem('api_key', apiKey);
      console.log('API key set from URL parameter');
    }
    
    // Check for IDX parameters
    const idxApiKey = params.get('idx_api_key');
    const idxApiVersion = params.get('idx_api_version');
    const idxAncillaryKey = params.get('idx_ancillary_key');
    
    if (idxApiKey) {
      localStorage.setItem('idx_api_key', idxApiKey);
      console.log('IDX API key set from URL parameter');
    }
    
    if (idxApiVersion) {
      localStorage.setItem('idx_api_version', idxApiVersion);
    }
    
    if (idxAncillaryKey) {
      localStorage.setItem('idx_ancillary_key', idxAncillaryKey);
    }
    
    // Check for Airtable parameters
    const airtableApiKey = params.get('airtable_api_key');
    const airtableBaseId = params.get('airtable_base_id');
    const airtableAgentFilter = params.get('airtable_agent_filter');
    
    if (airtableApiKey) {
      localStorage.setItem('airtable_api_key', airtableApiKey);
      console.log('Airtable API key set from URL parameter');
    }
    
    if (airtableBaseId) {
      localStorage.setItem('airtable_base_id', airtableBaseId);
    }
    
    if (airtableAgentFilter) {
      localStorage.setItem('airtable_agent_filter', airtableAgentFilter);
    }
    
    // Agent configuration from URL
    const agentName = params.get('agent_name');
    const agentBio = params.get('agent_bio');
    const agentPhoto = params.get('agent_photo');
    
    if (agentName) {
      localStorage.setItem('agent_name', agentName);
    }
    
    if (agentBio) {
      localStorage.setItem('agent_bio', agentBio);
    }
    
    if (agentPhoto) {
      localStorage.setItem('agent_photo', agentPhoto);
    }

    // If we have set any configuration parameters, show a toast notification
    if (params.has('idx_api_key') || params.has('airtable_api_key') || params.has('api_key')) {
      toast.success('Configuration updated from URL parameters');
      
      // Force reload to apply new settings
      if (!params.has('no_reload')) {
        // Check if we're in a browser environment
        if (typeof window !== 'undefined') {
          window.location.href = window.location.origin + window.location.pathname;
        }
      }
    }
  } catch (error) {
    console.error('Error initializing config from URL:', error);
  }
};

// Get a configuration value
export const getConfigValue = (key: keyof ConfigSettings): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key) || null;
};

// Set a configuration value
export const setConfigValue = (key: keyof ConfigSettings, value: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, value);
};

// Clear a configuration value
export const clearConfigValue = (key: keyof ConfigSettings): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
};

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
  try {
    if (config.idx_api_key) setConfigValue('idx_api_key', config.idx_api_key);
    if (config.idx_api_version) setConfigValue('idx_api_version', config.idx_api_version);
    if (config.idx_ancillary_key) setConfigValue('idx_ancillary_key', config.idx_ancillary_key);
    if (config.airtable_api_key) setConfigValue('airtable_api_key', config.airtable_api_key);
    if (config.airtable_base_id) setConfigValue('airtable_base_id', config.airtable_base_id);
    if (config.airtable_agent_filter) setConfigValue('airtable_agent_filter', config.airtable_agent_filter);
    if (config.api_key) setConfigValue('api_key', config.api_key);
    
    toast.success('Configuration imported successfully');
  } catch (error) {
    console.error('Error importing configuration:', error);
    toast.error('Failed to import configuration');
  }
};

// Generate a new API key
export const generateApiKey = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 32;
  let result = '';
  
  if (typeof window !== 'undefined') {
    const randomValues = new Uint8Array(length);
    window.crypto.getRandomValues(randomValues);
    
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

// Handle API request with configuration
export const handleConfigApiRequest = async (req: Request): Promise<Response> => {
  const apiKey = req.headers.get('X-API-Key');
  const storedApiKey = getConfigValue('api_key');
  
  // Check if API key is valid
  if (!apiKey || !storedApiKey || apiKey !== storedApiKey) {
    return new Response(JSON.stringify({ error: 'Invalid or missing API key' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Process the request based on method
  if (req.method === 'GET') {
    // Return the current configuration
    return new Response(JSON.stringify(exportConfig()), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if (req.method === 'POST') {
    try {
      // Update configuration with the provided values
      const body = await req.json();
      importConfig(body as Partial<ConfigSettings>);
      
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  // Method not allowed
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
};

// Save configuration to localStorage
export const saveToLocalStorage = (key: string, value: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

// Get configuration from localStorage
export const getFromLocalStorage = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};
