
import { toast } from 'sonner';
import { isBrowser } from './browserUtils';
import { setConfigValue } from './configStorage';

/**
 * Functions for initializing configuration from URL parameters
 */

export const initConfigFromUrl = () => {
  try {
    // Check if we're in a browser environment
    if (!isBrowser()) return;
    
    // Now we can safely use the window object
    const url = new URL(window.location.href);
    const params = url.searchParams;
    
    // Store tenantId if provided
    const tenantId = params.get('tenantId');
    if (tenantId) {
      setConfigValue('tenantId', tenantId);
      console.log('TenantId set from URL parameter:', tenantId);
    }
    
    // Check for API key parameter
    const apiKey = params.get('api_key');
    if (apiKey) {
      setConfigValue('api_key', apiKey);
      console.log('API key set from URL parameter');
    }
    
    // Check for IDX parameters
    const idxApiKey = params.get('idx_api_key');
    const idxApiVersion = params.get('idx_api_version');
    const idxAncillaryKey = params.get('idx_ancillary_key');
    
    if (idxApiKey) {
      setConfigValue('idx_api_key', idxApiKey);
      console.log('IDX API key set from URL parameter');
    }
    
    if (idxApiVersion) {
      setConfigValue('idx_api_version', idxApiVersion);
    }
    
    if (idxAncillaryKey) {
      setConfigValue('idx_ancillary_key', idxAncillaryKey);
    }
    
    // Check for Airtable parameters
    const airtableApiKey = params.get('airtable_api_key');
    const airtableBaseId = params.get('airtable_base_id');
    const airtableAgentFilter = params.get('airtable_agent_filter');
    
    if (airtableApiKey) {
      setConfigValue('airtable_api_key', airtableApiKey);
      console.log('Airtable API key set from URL parameter');
    }
    
    if (airtableBaseId) {
      setConfigValue('airtable_base_id', airtableBaseId);
    }
    
    if (airtableAgentFilter) {
      setConfigValue('airtable_agent_filter', airtableAgentFilter);
    }
    
    // Agent configuration from URL
    const agentName = params.get('agent_name');
    const agentBio = params.get('agent_bio');
    const agentPhoto = params.get('agent_photo');
    
    if (agentName) {
      setConfigValue('agent_name', agentName);
    }
    
    if (agentBio) {
      setConfigValue('agent_bio', agentBio);
    }
    
    if (agentPhoto) {
      setConfigValue('agent_photo', agentPhoto);
    }

    // If we have set any configuration parameters, show a toast notification
    if (params.has('idx_api_key') || params.has('airtable_api_key') || params.has('api_key') || params.has('tenantId')) {
      toast.success('Configuration updated from URL parameters');
      
      // Force reload to apply new settings
      if (!params.has('no_reload') && isBrowser()) {
        // Safely use location when we know we're in a browser
        window.location.href = window.location.origin + window.location.pathname;
      }
    }
  } catch (error) {
    console.error('Error initializing config from URL:', error);
  }
};
