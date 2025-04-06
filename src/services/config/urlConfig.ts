
import { toast } from 'sonner';
import { isBrowser } from './browserUtils';

/**
 * Functions for initializing configuration from URL parameters
 */

export const initConfigFromUrl = () => {
  try {
    // Check if we're in a browser environment
    if (!isBrowser) return;
    
    // Now we can safely use the window object
    const url = new URL((globalThis as any).location?.href || '');
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
        // Safely use location when we know we're in a browser
        if (isBrowser && (globalThis as any).location) {
          (globalThis as any).location.href = (globalThis as any).location.origin + (globalThis as any).location.pathname;
        }
      }
    }
  } catch (error) {
    console.error('Error initializing config from URL:', error);
  }
};
