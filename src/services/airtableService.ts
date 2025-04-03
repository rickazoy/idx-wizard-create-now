
import Airtable from 'airtable';

// Configure Airtable
// Note: In a production environment, these keys should be stored in environment variables
const AIRTABLE_API_KEY = 'your_airtable_api_key';
const AIRTABLE_BASE_ID = 'your_airtable_base_id';

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

export interface AirtableProperty {
  id: string;
  propertyAddress: string;
  propertySize: number;
  bedrooms: number;
  bathrooms: number;
  listingPrice: number;
  listingStatus: string;
  propertyImages: string[];
  propertyDescription: string;
  listingAgent: string;
  agentName: string;
  openHouseDates: string[];
  activityType: string;
  interestedLeads: string[];
  leadSourceDetails: string;
  marketingMaterials: string[];
  campaignName: string;
  videoFile: string;
  videoContent: string;
  showingHistory: {
    date: string;
    time: string;
  }[];
}

export const fetchProperties = async (): Promise<AirtableProperty[]> => {
  try {
    const records = await base('Properties').select({
      // You can add view, filterByFormula, etc. here
    }).all();
    
    return records.map(record => {
      const fields = record.fields;
      return {
        id: record.id,
        propertyAddress: fields['Property Address'] as string || '',
        propertySize: fields['Property Size'] as number || 0,
        bedrooms: fields['Number of Bedrooms'] as number || 0,
        bathrooms: fields['Number of Bathrooms'] as number || 0,
        listingPrice: fields['Listing Price'] as number || 0,
        listingStatus: fields['Listing Status'] as string || '',
        propertyImages: (fields['Property Images'] as string[] || []),
        propertyDescription: fields['Property Description'] as string || '',
        listingAgent: fields['Listing Agent'] as string || '',
        agentName: fields['Agent Name'] as string || '',
        openHouseDates: (fields['Open House Dates'] as string[] || []),
        activityType: fields['Activity Type'] as string || '',
        interestedLeads: (fields['Interested Leads/Contacts'] as string[] || []),
        leadSourceDetails: fields['Lead Source Details'] as string || '',
        marketingMaterials: (fields['Marketing materials'] as string[] || []),
        campaignName: fields['Campaign Name'] as string || '',
        videoFile: fields['Video File'] as string || '',
        videoContent: fields['Video Content'] as string || '',
        showingHistory: (fields['Showing History'] as { date: string; time: string }[] || [])
      };
    });
  } catch (error) {
    console.error('Error fetching properties from Airtable:', error);
    return [];
  }
};

export const fetchFeaturedVideos = async (): Promise<AirtableProperty[]> => {
  try {
    const records = await base('Properties').select({
      filterByFormula: "{Video File} != ''",
      maxRecords: 4
    }).all();
    
    return records.map(record => {
      const fields = record.fields;
      return {
        id: record.id,
        propertyAddress: fields['Property Address'] as string || '',
        propertySize: fields['Property Size'] as number || 0,
        bedrooms: fields['Number of Bedrooms'] as number || 0,
        bathrooms: fields['Number of Bathrooms'] as number || 0,
        listingPrice: fields['Listing Price'] as number || 0,
        listingStatus: fields['Listing Status'] as string || '',
        propertyImages: (fields['Property Images'] as string[] || []),
        propertyDescription: fields['Property Description'] as string || '',
        listingAgent: fields['Listing Agent'] as string || '',
        agentName: fields['Agent Name'] as string || '',
        openHouseDates: (fields['Open House Dates'] as string[] || []),
        activityType: fields['Activity Type'] as string || '',
        interestedLeads: (fields['Interested Leads/Contacts'] as string[] || []),
        leadSourceDetails: fields['Lead Source Details'] as string || '',
        marketingMaterials: (fields['Marketing materials'] as string[] || []),
        campaignName: fields['Campaign Name'] as string || '',
        videoFile: fields['Video File'] as string || '',
        videoContent: fields['Video Content'] as string || '',
        showingHistory: (fields['Showing History'] as { date: string; time: string }[] || [])
      };
    });
  } catch (error) {
    console.error('Error fetching video properties from Airtable:', error);
    return [];
  }
};
