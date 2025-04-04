
import { Attachment } from 'airtable';
import { getBase, buildFilterFormula } from './airtableCore';

const CAMPAIGN_TABLE_NAME = 'Content Campaigns';

export interface Campaign {
  id: string;
  title: string;
  description?: string;
  videoFile?: Array<{
    url: string;
    filename: string;
  }>;
  primaryRealtor?: string;
  propertyAddress?: string;
  campaignType?: string;
  dateCreated?: string;
  status?: string;
  thumbnailUrl?: string;
}

export const fetchCampaignVideos = async (): Promise<Campaign[]> => {
  try {
    const base = getBase();
    if (!base) return [];
    
    // Get agent filter to match with Primary Realtor field
    const agentFilter = localStorage.getItem('airtable_agent_filter') || '';
    let filterFormula = '';
    
    // Build filter formula based on agent selection
    if (agentFilter && agentFilter !== 'all') {
      // If the agent filter value looks like a record ID (starts with 'rec')
      if (agentFilter.startsWith('rec')) {
        // Filter by Agent record ID
        filterFormula = `{Primary Realtor} = '${agentFilter}'`;
      } else {
        // Filter by Agent Name
        filterFormula = `{Primary Realtor} = '${agentFilter}'`;
      }
    }
    
    // Only fetch records that have video files
    const videoFilter = "NOT({Video File} = '')";
    filterFormula = filterFormula 
      ? `AND(${filterFormula}, ${videoFilter})` 
      : videoFilter;
    
    console.log('Campaign video filter formula:', filterFormula);
    
    const records = await base(CAMPAIGN_TABLE_NAME)
      .select({
        filterByFormula: filterFormula,
        maxRecords: 4
      })
      .all();
    
    console.log(`Found ${records.length} campaign videos`);
    
    return records.map(record => {
      const fields = record.fields;
      
      const videoFile = fields['Video File'] as readonly Attachment[] | undefined;
      const thumbnail = fields['Thumbnail'] as readonly Attachment[] | undefined;
      
      return {
        id: record.id,
        title: fields['Campaign Title'] as string || '',
        description: fields['Campaign Description'] as string || '',
        videoFile: videoFile ? videoFile.map(video => ({
          url: video.url || '',
          filename: video.filename || ''
        })) : [],
        primaryRealtor: fields['Primary Realtor'] as string || '',
        propertyAddress: fields['Property Address'] as string || '',
        campaignType: fields['Campaign Type'] as string || '',
        dateCreated: fields['Date Created'] as string || '',
        status: fields['Status'] as string || '',
        thumbnailUrl: thumbnail && thumbnail.length > 0 ? thumbnail[0].url : ''
      };
    });
  } catch (error) {
    console.error('Error fetching campaign videos from Airtable:', error);
    return [];
  }
};

export const fetchFeaturedCampaignVideos = async (): Promise<Campaign[]> => {
  try {
    return await fetchCampaignVideos();
  } catch (error) {
    console.error('Error fetching featured campaign videos:', error);
    return [];
  }
};
