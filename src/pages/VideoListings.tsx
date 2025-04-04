
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCampaignVideos, Campaign } from '@/services/airtable/campaignService';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Video, Loader2 } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import SetupAirtablePrompt from '@/components/SetupAirtablePrompt';
import ApplicationWrapper from '@/components/ApplicationWrapper';

const VideoListings = () => {
  const { data: campaigns, isLoading, error } = useQuery({
    queryKey: ['campaignVideos'],
    queryFn: fetchCampaignVideos,
  });

  const fallbackVideos: Campaign[] = [
    {
      id: 'v1',
      title: 'Luxury Ocean View Tour',
      propertyAddress: '789 Ocean Drive',
      description: 'Stunning oceanfront property with panoramic views',
      videoFile: []
    },
    {
      id: 'v2',
      title: 'Mountain Retreat Experience',
      propertyAddress: '456 Mountain View',
      description: 'Luxurious mountain retreat with private forest views',
      videoFile: []
    },
    {
      id: 'v3',
      title: 'Urban Living Tour',
      propertyAddress: '123 Sunset Boulevard',
      description: 'Contemporary home in a peaceful neighborhood',
      videoFile: []
    },
    {
      id: 'v4',
      title: 'Riverside Property Showcase',
      propertyAddress: '321 River Road',
      description: 'Cozy riverfront property with private dock',
      videoFile: []
    }
  ];

  const videosToDisplay = campaigns && campaigns.length > 0 ? campaigns : fallbackVideos;
  const isAirtableConfigured = localStorage.getItem('airtable_api_key') && localStorage.getItem('airtable_base_id');

  const getVideoThumbnail = (campaign: Campaign) => {
    if (campaign.thumbnailUrl) {
      return campaign.thumbnailUrl;
    }
    if (Array.isArray(campaign.videoFile) && campaign.videoFile.length > 0) {
      return campaign.videoFile[0].url;
    }
    return 'https://placehold.co/600x400?text=No+Video';
  };

  return (
    <ApplicationWrapper>
      <div className="min-h-screen bg-gray-50 pb-16">
        <div className="hero-section pt-8 pb-12">
          <div className="container-custom">
            <h1 className="text-4xl font-bold mb-6 text-center">Property Video Tours</h1>
            <p className="text-xl mb-8 text-center max-w-2xl mx-auto">
              Explore our properties through immersive video tours
            </p>
            <SearchBar />
          </div>
        </div>

        <div className="container-custom mt-12">
          {!isAirtableConfigured && (
            <SetupAirtablePrompt className="mb-8" />
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3">Loading video tours...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">Error loading videos. Please check your Airtable connection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videosToDisplay.map((campaign) => (
                <Card key={campaign.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative group">
                      <AspectRatio ratio={16/9}>
                        <img 
                          src={getVideoThumbnail(campaign)} 
                          alt={campaign.title || campaign.propertyAddress || ''} 
                          className="object-cover rounded-t-lg w-full h-full"
                        />
                      </AspectRatio>
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity group-hover:bg-black/60">
                        <Button 
                          size="icon" 
                          className="h-16 w-16 rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/40"
                        >
                          <Video className="h-8 w-8" />
                          <span className="sr-only">Play Video</span>
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg truncate">
                        {campaign.title || campaign.propertyAddress || ''}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {campaign.description || ''}
                      </p>
                      {campaign.primaryRealtor && (
                        <p className="text-xs text-gray-500 mt-2">
                          Agent: {campaign.primaryRealtor}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ApplicationWrapper>
  );
};

export default VideoListings;
