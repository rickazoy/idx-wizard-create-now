
import Airtable from 'airtable';

// Table names in the Airtable base
export const PROPERTY_TABLE_NAME = 'Property Management System Listings';
export const AGENT_TABLE_NAME = 'tblb5oePiv62IFWN1'; // Use the exact table ID from the URL

// Get API token and base ID from localStorage or environment variables
export const getApiKey = () => localStorage.getItem('airtable_api_key') || import.meta.env.VITE_AIRTABLE_API_KEY || '';
export const getBaseId = () => localStorage.getItem('airtable_base_id') || import.meta.env.VITE_AIRTABLE_BASE_ID || '';
export const getAgentFilter = () => localStorage.getItem('airtable_agent_filter') || '';

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
    if (cleanBaseId.includes('airtable.com/app')) {
      const appMatch = cleanBaseId.match(/app[A-Za-z0-9]+/);
      if (appMatch) {
        cleanBaseId = appMatch[0];
      }
    }
    
    console.log('Using base ID:', cleanBaseId);
    
    const testBase = new Airtable({ apiKey }).base(cleanBaseId);
    
    // Try to connect to the agent table first (since that's what we're working with)
    try {
      await testBase(AGENT_TABLE_NAME).select({ maxRecords: 1 }).firstPage();
      console.log('Successfully connected to Agents table');
    } catch (agentErr: any) {
      console.log('Could not connect to Agents table directly:', agentErr.message);
      
      // If we can't connect to Agents table directly, try to connect to property table
      try {
        await testBase(PROPERTY_TABLE_NAME).select({ maxRecords: 1 }).firstPage();
        console.log('Successfully connected to Property Management System Listings table');
      } catch (propertyErr: any) {
        if (propertyErr.statusCode === 404) {
          console.error('Property Management System Listings table not found');
        }
        throw propertyErr;
      }
    }
    
    // Store the cleaned values
    localStorage.setItem('airtable_api_key', apiKey);
    localStorage.setItem('airtable_base_id', cleanBaseId);
    
    return true;
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
      const agentCondition = `FIND('${agentFilter}', ARRAYJOIN({Listing Agent})) > 0`;
      formula = formula ? `AND(${formula}, ${agentCondition})` : agentCondition;
    } else {
      // Otherwise, treat it as a regular string value
      const agentCondition = `{Listing Agent} = '${agentFilter}'`;
      formula = formula ? `AND(${formula}, ${agentCondition})` : agentCondition;
    }
  }
  
  return formula || '';
};
