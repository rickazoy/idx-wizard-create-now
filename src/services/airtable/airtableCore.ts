
import Airtable from 'airtable';

// Table names in the Airtable base
export const PROPERTY_TABLE_NAME = 'Property Management System Listings';
export const AGENT_TABLE_NAME = 'Agents';

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
    // Clean up the baseId - remove any URLs and just keep the ID part
    const cleanBaseId = baseId.trim().replace(/^https:\/\/airtable\.com\//, '').split('/')[0];
    
    const testBase = new Airtable({ apiKey }).base(cleanBaseId);
    
    // First try to connect to the property table
    try {
      await testBase(PROPERTY_TABLE_NAME).select({ maxRecords: 1 }).firstPage();
      console.log('Successfully connected to Property Management System Listings table');
    } catch (err: any) {
      if (err.statusCode === 404) {
        console.error('Property Management System Listings table not found');
      }
      throw err;
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
