
import { Attachment } from 'airtable';
import { getBase } from './airtableCore';

export const CAMPAIGN_TABLE_NAME = 'Content Campaigns';

export interface Campaign {
  id: string;
  name: string;
  description: string;
  videoFile?: {
    url: string;
    filename: string;
  };
  primaryRealtor?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  title?: string;
  propertyAddress?: string;
}

export const fetchCampaigns = async (): Promise<Campaign[]> => {
  try {
    const base = getBase();
    if (!base) return [];
    
    // Get agent filter from localStorage
    const agentFilter = localStorage.getItem('airtable_agent_filter');
    
    // Build filterByFormula based on selected agent
    let filterFormula = '';
    if (agentFilter && agentFilter !== 'all') {
      filterFormula = `{Primary Realtor} = '${agentFilter}'`;
    }
    
    // Create select params
    const selectParams: any = {
      filterByFormula: filterFormula || '',
      sort: [{ field: 'Campaign Name', direction: 'desc' }]
    };
    
    // If no filter formula, remove the property
    if (!filterFormula) {
      delete selectParams.filterByFormula;
    }
    
    const records = await base(CAMPAIGN_TABLE_NAME).select(selectParams).all();
    
    return records.map(record => {
      const fields = record.fields;
      
      const videoFile = fields['Video File'] as readonly Attachment[] | undefined;
      const thumbnailImage = fields['Thumbnail Image'] as readonly Attachment[] | undefined;
      
      return {
        id: record.id,
        name: fields['Campaign Name'] as string || 'Unnamed Campaign',
        title: fields['Campaign Name'] as string || 'Unnamed Campaign',
        description: fields['Campaign Description'] as string || '',
        propertyAddress: fields['Property Address'] as string,
        videoFile: videoFile && videoFile.length > 0 ? {
          url: videoFile[0].url,
          filename: videoFile[0].filename
        } : undefined,
        primaryRealtor: fields['Primary Realtor'] as string,
        imageUrl: thumbnailImage && thumbnailImage.length > 0 ? thumbnailImage[0].url : undefined,
        thumbnailUrl: thumbnailImage && thumbnailImage.length > 0 ? thumbnailImage[0].url : undefined
      };
    });
  } catch (error) {
    console.error('Error fetching campaigns from Airtable:', error);
    return [];
  }
};

// Modified to work with React Query context
export const fetchFeaturedCampaigns = async () => {
  try {
    const campaigns = await fetchCampaigns();
    
    // Filter campaigns with video files
    const campaignsWithVideo = campaigns.filter(campaign => campaign.videoFile);
    
    // Return limited number of campaigns (default 4)
    return campaignsWithVideo.slice(0, 4);
  } catch (error) {
    console.error('Error fetching featured campaigns:', error);
    return [];
  }
};

// Function that accepts a limit parameter separately for when it's called directly
export const fetchFeaturedCampaignsWithLimit = async (limit = 4): Promise<Campaign[]> => {
  try {
    const campaigns = await fetchCampaigns();
    
    // Filter campaigns with video files
    const campaignsWithVideo = campaigns.filter(campaign => campaign.videoFile);
    
    // Return limited number of campaigns
    return campaignsWithVideo.slice(0, limit);
  } catch (error) {
    console.error('Error fetching featured campaigns:', error);
    return [];
  }
};

// Add this function to match what VideoListings is importing
export const fetchCampaignVideos = async () => {
  // Reuse the fetchCampaigns function
  return fetchCampaigns();
};

