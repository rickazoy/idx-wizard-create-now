
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
    
    try {
      // Try to get records from the Agents table using the exact field names
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

      console.log('Raw agent record:', fields);

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
    } catch (error: any) {
      console.error('Error fetching from Agents table:', error);
      if (error.statusCode === 404) {
        console.error('Make sure the table name matches exactly: tblb5oePiv62IFWN1');
      }
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
    
    try {
      // First try to fetch existing records
      const records = await base(AGENT_TABLE_NAME).select({
        maxRecords: 1,
      }).firstPage();
      
      // Create fields for agent data
      const fields: Record<string, any> = {
        'Agent Name': agent.name,
        'Agent Bio': agent.bio,
      };

      // Only include photo if it's a valid URL
      if (agent.photo && (agent.photo.startsWith('http') || agent.photo.startsWith('blob:'))) {
        // For blob URLs, we can't directly save them to Airtable
        // Just log this for now
        if (agent.photo.startsWith('blob:')) {
          console.log('Blob URLs cannot be saved directly to Airtable:', agent.photo);
          // You would need to convert the blob to a file and upload it
        } else {
          fields['Agent Photo'] = [
            {
              url: agent.photo
            }
          ];
        }
      }
      
      let result;
      if (records.length > 0) {
        // Update existing record
        console.log('Updating existing agent record:', records[0].id);
        result = await base(AGENT_TABLE_NAME).update(records[0].id, fields);
      } else {
        // Create new record
        console.log('Creating new agent record');
        result = await base(AGENT_TABLE_NAME).create(fields);
      }
      
      console.log('Agent record saved:', result.id);
      return true;
    } catch (error: any) {
      console.error('Error saving to Agents table:', error);
      if (error.statusCode === 404) {
        console.error('The table tblb5oePiv62IFWN1 was not found. Please verify the table ID.');
      }
      if (error.statusCode === 422) {
        console.error('Invalid field names. Please ensure your table has fields named: Agent Name, Agent Bio, and Agent Photo');
      }
      return false;
    }
  } catch (error) {
    console.error('Error saving agent data to Airtable:', error);
    return false;
  }
};
