
import { Attachment } from 'airtable';
import { getBase, PROPERTY_TABLE_NAME, buildFilterFormula } from './airtableCore';

interface ShowingDate {
  date: string;
  time: string;
}

export interface Property {
  id: string;
  address: string;
  size?: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  status: string;
  images?: Array<{
    url: string;
    filename: string;
  }>;
  description?: string;
  agentName?: string;
  openHouseDates?: string[];
  activityType?: string;
  interestedLeads?: string[];
  leadSource?: string;
  marketingMaterials?: Array<{
    url: string;
    filename: string;
  }>;
  campaignName?: string;
  videoFile?: Array<{
    url: string;
    filename: string;
  }>;
  videoContent?: string;
  showingHistory?: ShowingDate[];
  dateAndTime?: string;
  city: string;
  state: string;
  zipCode: string;
  squareFeet: number;
  propertyType: string;
  listingType: string;
  listingAgent?: string;
  imageUrl: string;
  propertyAddress?: string;
  propertyDescription?: string;
  yearBuilt?: number;
  lotSize?: number;
  garage?: number;
  propertyTax?: number;
  features?: string[];
}

// Function to get all properties
export const getProperties = async (): Promise<Property[]> => {
  try {
    const base = getBase();
    if (!base) return [];
    
    const filterFormula = buildFilterFormula();
    const selectParams: any = {};
    
    if (filterFormula) {
      selectParams.filterByFormula = filterFormula;
    }
    
    const records = await base(PROPERTY_TABLE_NAME).select(selectParams).all();
    return records.map(record => {
      const fields = record.fields;
      
      // Type casting to handle the Airtable attachment type
      const images = fields['Property Images'] as readonly Attachment[] | undefined;
      const marketingMaterials = fields['Marketing materials'] as readonly Attachment[] | undefined;
      const videoFile = fields['Video File'] as readonly Attachment[] | undefined;
      const showingHistory = fields['Showing History'] as unknown as ShowingDate[] | undefined;
      
      return {
        id: record.id,
        address: fields['Property Address'] as string || '',
        size: fields['Property Size'] as number || 0,
        bedrooms: fields['Number of Bedrooms'] as number || 0,
        bathrooms: fields['Number of Bathrooms'] as number || 0,
        price: fields['Listing Price'] as number || 0,
        status: fields['Listing Status'] as string || '',
        images: images?.map(image => ({
          url: image.url || '',
          filename: image.filename || ''
        })),
        description: fields['Property Description'] as string || '',
        agentName: fields['Listing Agent'] as string || '',
        openHouseDates: fields['Open House Dates'] as string[] || [],
        activityType: fields['Activity Type'] as string || '',
        interestedLeads: fields['Interested Leads/Contacts'] as string[] || [],
        leadSource: fields['Lead Source Details'] as string || '',
        marketingMaterials: marketingMaterials?.map(material => ({
          url: material.url || '',
          filename: material.filename || ''
        })),
        campaignName: fields['Campaign Name'] as string || '',
        videoFile: videoFile?.map(video => ({
          url: video.url || '',
          filename: video.filename || ''
        })),
        videoContent: fields['Video Content'] as string || '',
        showingHistory: showingHistory || [],
        dateAndTime: fields['Date and Time'] as string || '',
        city: fields['City'] as string || 'Unknown City',
        state: fields['State'] as string || 'Unknown State',
        zipCode: fields['Zip Code'] as string || 'Unknown',
        squareFeet: fields['Property Size'] as number || 0,
        propertyType: fields['Property Type'] as string || 'Unknown',
        listingType: fields['Listing Type'] as string || '',
        listingAgent: fields['Listing Agent'] as string || '',
        yearBuilt: fields['Year Built'] as number || 0,
        lotSize: fields['Lot Size'] as number || 0,
        garage: fields['Garage'] as number || 0,
        propertyTax: fields['Property Tax'] as number || 0,
        features: fields['Features'] as string[] || [],
        imageUrl: images && images.length > 0 ? images[0].url : 'https://placehold.co/600x400?text=No+Image'
      };
    });
  } catch (error) {
    console.error('Error fetching properties from Airtable:', error);
    return [];
  }
};

// Function to get property by ID
export const getPropertyById = async (id: string): Promise<Property | null> => {
  try {
    const base = getBase();
    if (!base) return null;
    
    const record = await base(PROPERTY_TABLE_NAME).find(id);
    const fields = record.fields;
    
    // Type casting to handle the Airtable attachment type
    const images = fields['Property Images'] as readonly Attachment[] | undefined;
    const marketingMaterials = fields['Marketing materials'] as readonly Attachment[] | undefined;
    const videoFile = fields['Video File'] as readonly Attachment[] | undefined;
    const showingHistory = fields['Showing History'] as unknown as ShowingDate[] | undefined;
    
    return {
      id: record.id,
      address: fields['Property Address'] as string || '',
      size: fields['Property Size'] as number || 0,
      bedrooms: fields['Number of Bedrooms'] as number || 0,
      bathrooms: fields['Number of Bathrooms'] as number || 0,
      price: fields['Listing Price'] as number || 0,
      status: fields['Listing Status'] as string || '',
      images: images?.map(image => ({
        url: image.url || '',
        filename: image.filename || ''
      })),
      description: fields['Property Description'] as string || '',
      agentName: fields['Listing Agent'] as string || '',
      openHouseDates: fields['Open House Dates'] as string[] || [],
      activityType: fields['Activity Type'] as string || '',
      interestedLeads: fields['Interested Leads/Contacts'] as string[] || [],
      leadSource: fields['Lead Source Details'] as string || '',
      marketingMaterials: marketingMaterials?.map(material => ({
        url: material.url || '',
        filename: material.filename || ''
      })),
      campaignName: fields['Campaign Name'] as string || '',
      videoFile: videoFile?.map(video => ({
        url: video.url || '',
        filename: video.filename || ''
      })),
      videoContent: fields['Video Content'] as string || '',
      showingHistory: showingHistory || [],
      dateAndTime: fields['Date and Time'] as string || '',
      city: fields['City'] as string || 'Unknown City',
      state: fields['State'] as string || 'Unknown State',
      zipCode: fields['Zip Code'] as string || 'Unknown',
      squareFeet: fields['Property Size'] as number || 0,
      propertyType: fields['Property Type'] as string || 'Unknown',
      listingType: fields['Listing Type'] as string || '',
      listingAgent: fields['Listing Agent'] as string || '',
      yearBuilt: fields['Year Built'] as number || 0,
      lotSize: fields['Lot Size'] as number || 0,
      garage: fields['Garage'] as number || 0,
      propertyTax: fields['Property Tax'] as number || 0,
      features: fields['Features'] as string[] || [],
      imageUrl: images && images.length > 0 ? images[0].url : 'https://placehold.co/600x400?text=No+Image'
    };
  } catch (error) {
    console.error('Error fetching property by ID from Airtable:', error);
    return null;
  }
};

// Function to get properties with videos
export const getPropertiesWithVideos = async (): Promise<Property[]> => {
  try {
    const base = getBase();
    if (!base) return [];
    
    const filterFormula = buildFilterFormula('NOT({Video File} = "")');
    
    const records = await base(PROPERTY_TABLE_NAME)
      .select({
        filterByFormula: filterFormula
      })
      .all();
    
    return records.map(record => {
      const fields = record.fields;
      
      // Type casting to handle the Airtable attachment type
      const images = fields['Property Images'] as readonly Attachment[] | undefined;
      const videoFile = fields['Video File'] as readonly Attachment[] | undefined;
      
      return {
        id: record.id,
        address: fields['Property Address'] as string || '',
        bedrooms: fields['Number of Bedrooms'] as number || 0,
        bathrooms: fields['Number of Bathrooms'] as number || 0,
        price: fields['Listing Price'] as number || 0,
        status: fields['Listing Status'] as string || '',
        videoFile: videoFile?.map(video => ({
          url: video.url || '',
          filename: video.filename || ''
        })),
        videoContent: fields['Video Content'] as string || '',
        city: fields['City'] as string || 'Unknown City',
        state: fields['State'] as string || 'Unknown State',
        zipCode: fields['Zip Code'] as string || 'Unknown',
        squareFeet: fields['Property Size'] as number || 0,
        propertyType: fields['Property Type'] as string || 'Unknown',
        listingType: fields['Listing Type'] as string || '',
        listingAgent: fields['Listing Agent'] as string || '',
        imageUrl: images && images.length > 0 ? images[0].url : 'https://placehold.co/600x400?text=No+Image'
      };
    });
  } catch (error) {
    console.error('Error fetching properties with videos from Airtable:', error);
    return [];
  }
};

// Function to fetch featured videos for the video section
export const fetchFeaturedVideos = async (): Promise<Property[]> => {
  try {
    const base = getBase();
    if (!base) return [];
    
    const filterFormula = buildFilterFormula('NOT({Video File} = "")');
    
    const records = await base(PROPERTY_TABLE_NAME)
      .select({
        filterByFormula: filterFormula,
        maxRecords: 4
      })
      .all();
    
    return records.map(record => {
      const fields = record.fields;
      
      // Type casting to handle the Airtable attachment type
      const images = fields['Property Images'] as readonly Attachment[] | undefined;
      const videoFile = fields['Video File'] as readonly Attachment[] | undefined;
      
      return {
        id: record.id,
        address: fields['Property Address'] as string || '',
        propertyAddress: fields['Property Address'] as string || '',
        propertyDescription: fields['Property Description'] as string || '',
        bedrooms: fields['Number of Bedrooms'] as number || 0,
        bathrooms: fields['Number of Bathrooms'] as number || 0,
        price: fields['Listing Price'] as number || 0,
        status: fields['Listing Status'] as string || '',
        description: fields['Property Description'] as string || '',
        videoFile: videoFile ? videoFile.map(video => ({
          url: video.url || '',
          filename: video.filename || ''
        })) : [],
        videoContent: fields['Video Content'] as string || '',
        city: fields['City'] as string || 'Unknown City',
        state: fields['State'] as string || 'Unknown State',
        zipCode: fields['Zip Code'] as string || 'Unknown',
        squareFeet: fields['Property Size'] as number || 0,
        propertyType: fields['Property Type'] as string || 'Unknown',
        listingType: fields['Listing Type'] as string || '',
        listingAgent: fields['Listing Agent'] as string || '',
        imageUrl: images && images.length > 0 ? images[0].url : 'https://placehold.co/600x400?text=No+Image'
      };
    });
  } catch (error) {
    console.error('Error fetching properties with videos from Airtable:', error);
    return [];
  }
};

// Function to get properties for sale
export const getPropertiesForSale = async (): Promise<Property[]> => {
  try {
    const base = getBase();
    if (!base) return [];
    
    const filterFormula = buildFilterFormula('{Listing Type} = "For Sale"');
    
    const records = await base(PROPERTY_TABLE_NAME)
      .select({
        filterByFormula: filterFormula
      })
      .all();
    
    return records.map(record => {
      const fields = record.fields;
      
      // Type casting to handle the Airtable attachment type
      const images = fields['Property Images'] as readonly Attachment[] | undefined;
      
      return {
        id: record.id,
        address: fields['Property Address'] as string || '',
        bedrooms: fields['Number of Bedrooms'] as number || 0,
        bathrooms: fields['Number of Bathrooms'] as number || 0,
        price: fields['Listing Price'] as number || 0,
        status: fields['Listing Status'] as string || '',
        description: fields['Property Description'] as string || '',
        city: fields['City'] as string || 'Unknown City',
        state: fields['State'] as string || 'Unknown State',
        zipCode: fields['Zip Code'] as string || 'Unknown',
        squareFeet: fields['Property Size'] as number || 0,
        propertyType: fields['Property Type'] as string || 'Unknown',
        listingType: 'For Sale',
        listingAgent: fields['Listing Agent'] as string || '',
        imageUrl: images && images.length > 0 ? images[0].url : 'https://placehold.co/600x400?text=No+Image'
      };
    });
  } catch (error) {
    console.error('Error fetching properties for sale from Airtable:', error);
    return [];
  }
};
