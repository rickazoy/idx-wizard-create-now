
import Airtable from 'airtable';

// Table names in the Airtable base
export const PROPERTY_TABLE_NAME = 'Property Management System Listings';
export const AGENT_TABLE_NAME = 'Agents';

// Hardcoded Airtable credentials
const HARDCODED_API_KEY = 'patAGsXedkQ6H47U1.ab0037fa9de52f3adf981eb39379e24d16900e2ad1c03358cd2e80e04237b9f4';
const HARDCODED_BASE_ID = 'appH7qo4cb2dorb8X';

// Get API token and base ID from localStorage or environment variables or use hardcoded values
export const getApiKey = () => {
  const key = localStorage.getItem('airtable_api_key') || HARDCODED_API_KEY;
  console.log('Retrieved API key:', key ? 'Key exists' : 'No key found');
  return key;
};

export const getBaseId = () => {
  const baseId = localStorage.getItem('airtable_base_id') || HARDCODED_BASE_ID;
  console.log('Retrieved Base ID:', baseId || 'No base ID found');
  return baseId;
};

export const getAgentFilter = () => {
  const filter = localStorage.getItem('airtable_agent_filter') || '';
  console.log('Retrieved Agent Filter:', filter || 'No filter found');
  return filter;
};

// Initialize Airtable base
export const getBase = () => {
  const apiKey = getApiKey();
  const baseId = getBaseId();
  
  if (!apiKey || !baseId) {
    console.error('Missing Airtable credentials. Please configure in settings.');
    return null;
  }
  
  try {
    return new Airtable({ apiKey }).base(baseId);
  } catch (error) {
    console.error('Error initializing Airtable base:', error);
    return null;
  }
};

// Test connection to Airtable and save config
export const saveAirtableConfig = async (apiKey: string, baseId: string): Promise<boolean> => {
  try {
    // Extract the app ID from various possible URL formats
    let cleanBaseId = baseId.trim();
    
    // Handle the appXXXXXX format in URL
    if (cleanBaseId.includes('/')) {
      // Extract just the appXXXXXX part if it's a full URL
      const appMatch = cleanBaseId.match(/app[A-Za-z0-9]+/);
      if (appMatch) {
        cleanBaseId = appMatch[0];
        console.log('Extracted Base ID:', cleanBaseId);
      }
    }
    
    console.log('Using base ID:', cleanBaseId);
    
    const testBase = new Airtable({ apiKey }).base(cleanBaseId);
    
    // Try to connect to the agent table first (since that's what we're working with)
    try {
      const records = await testBase(AGENT_TABLE_NAME).select({ maxRecords: 1 }).firstPage();
      console.log('Successfully connected to Agents table');
      
      // If reaching this point, we have a successful connection
      // Store the cleaned values and ensure they're saved properly
      localStorage.setItem('airtable_api_key', apiKey);
      localStorage.setItem('airtable_base_id', cleanBaseId);
      
      // Log the storage action for debugging
      console.log('Configuration stored in localStorage:', {
        api_key_saved: !!apiKey,
        base_id_saved: !!cleanBaseId,
        localStorage_size: JSON.stringify(localStorage).length,
      });
      
      return true;
    } catch (agentErr: any) {
      console.log('Could not connect to Agents table directly:', agentErr.message);
      
      // If we can't connect to Agents table directly, try to connect to property table
      try {
        await testBase(PROPERTY_TABLE_NAME).select({ maxRecords: 1 }).firstPage();
        console.log('Successfully connected to Property Management System Listings table');
        
        // If reaching this point, we have a successful connection
        // Store the cleaned values
        localStorage.setItem('airtable_api_key', apiKey);
        localStorage.setItem('airtable_base_id', cleanBaseId);
        
        console.log('Configuration stored in localStorage:', {
          api_key_saved: !!apiKey,
          base_id_saved: !!cleanBaseId,
          localStorage_size: JSON.stringify(localStorage).length,
        });
        
        return true;
      } catch (propertyErr: any) {
        if (propertyErr.statusCode === 404) {
          console.error('Property Management System Listings table not found');
        }
        throw propertyErr;
      }
    }
  } catch (error) {
    console.error('Error connecting to Airtable:', error);
    throw new Error('Failed to connect to Airtable with provided credentials');
  }
};

// Function to build filter formula based on settings
export const buildFilterFormula = (baseFilter?: string): string => {
  const agentFilter = getAgentFilter();
  
  // Start with the base filter if provided
  let formula = baseFilter || '';
  
  // Add agent filter if specified
  if (agentFilter && agentFilter !== 'all') {
    // If the agent filter value looks like a record ID (starts with 'rec')
    if (agentFilter.startsWith('rec')) {
      // Get the listing by Agent record ID
      const agentCondition = `FIND('${agentFilter}', ARRAYJOIN({Listing Agent})) > 0`;
      formula = formula ? `AND(${formula}, ${agentCondition})` : agentCondition;
    } else {
      // Use the Agent Name field for filtering
      const agentCondition = `{Listing Agent} = '${agentFilter}'`;
      formula = formula ? `AND(${formula}, ${agentCondition})` : agentCondition;
    }
  }
  
  return formula || '';
};
