
import { Attachment } from 'airtable';
import { getBase, AGENT_TABLE_NAME } from './airtableCore';

// Interface for Agent data
export interface Agent {
  id: string;
  name: string;
  bio: string;
  photo?: string;
}

// Fetch all listing agents from Airtable
export const fetchListingAgents = async (apiKey?: string, baseId?: string): Promise<string[]> => {
  try {
    const base = getBase();
    if (!base) return [];
    
    const records = await base(AGENT_TABLE_NAME).select({
      fields: ['Agent Name'],
      filterByFormula: 'NOT({Agent Name} = "")',
    }).all();
    
    console.log('Agent records:', records.map(r => r.get('Agent Name')));
    
    // Extract agent names
    const agents = new Set<string>();
    records.forEach(record => {
      const agent = record.get('Agent Name');
      if (agent) {
        if (typeof agent === 'string') {
          agents.add(agent);
        } else if (Array.isArray(agent)) {
          agent.forEach(id => {
            if (typeof id === 'string') agents.add(id);
          });
        }
      }
    });
    
    console.log('Extracted agents:', Array.from(agents));
    
    return Array.from(agents).sort();
  } catch (error) {
    console.error('Error fetching agents from Airtable:', error);
    return [];
  }
};

// Function to get primary agent data
export const getPrimaryAgent = async (): Promise<Agent | null> => {
  try {
    const base = getBase();
    if (!base) return null;
    
    console.log(`Fetching agent data from Airtable (${new Date().toISOString()})`);
    
    // Create Agents table if it doesn't exist
    try {
      // First try to get records from Agents table
      const records = await base(AGENT_TABLE_NAME).select({
        maxRecords: 1,
        sort: [{ field: 'Agent Name', direction: 'asc' }]
      }).firstPage();
      
      if (records.length === 0) {
        console.log('No agent records found in Airtable');
        return null;
      }
      
      const agentRecord = records[0];
      const fields = agentRecord.fields;

      // Type casting to handle the Airtable attachment type
      const photo = fields['Agent Photo'] as readonly Attachment[] | undefined;
      const photoUrl = photo && photo.length > 0 ? photo[0].url : undefined;
      
      const agent: Agent = {
        id: agentRecord.id,
        name: fields['Agent Name'] as string || 'Default Agent',
        bio: fields['Agent Bio'] as string || 'A seasoned real estate agent specializing in luxury properties.',
        photo: photoUrl
      };
      
      console.log('Agent data fetched successfully:', {
        id: agent.id,
        name: agent.name,
        bioLength: agent.bio?.length || 0,
        hasPhoto: !!agent.photo
      });
      
      return agent;
    } catch (error) {
      console.error('Error fetching from Agents table, it may not exist yet:', error);
      return null;
    }
  } catch (error) {
    console.error('Error fetching agent from Airtable:', error);
    return null;
  }
};

// Function to save agent data to Airtable
export const updateAgent = async (agent: Omit<Agent, 'id'>): Promise<boolean> => {
  try {
    const base = getBase();
    if (!base) {
      console.error('Could not connect to Airtable');
      return false;
    }
    
    console.log(`Attempting to save agent data to Airtable (${new Date().toISOString()})`, agent);
    
    // Check if the Agents table exists by trying to create a record
    try {
      // Create fields for new agent
      const fields: Record<string, any> = {
        'Agent Name': agent.name,
        'Agent Bio': agent.bio,
      };

      // Only include photo if it's a valid URL
      if (agent.photo && agent.photo.startsWith('http')) {
        fields['Agent Photo'] = [
          {
            url: agent.photo
          }
        ];
      }
      
      // Try to create a new record in the Agents table
      const result = await base(AGENT_TABLE_NAME).create(fields);
      console.log('Created new agent record:', result.id);
      return true;
    } catch (error: any) {
      // Check if the error is due to the table not existing
      if (error.statusCode === 404) {
        console.error('The Agents table does not exist in this Airtable base. Please create it first.');
        return false;
      }
      throw error; // Re-throw for other errors
    }
  } catch (error) {
    console.error('Error saving agent data to Airtable:', error);
    return false;
  }
};
