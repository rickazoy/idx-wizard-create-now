
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchFeaturedVideos, Property } from '@/services/airtableService';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';
import SearchBar from '@/components/SearchBar';

const VideoListings = () => {
  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['propertyVideos'],
    queryFn: fetchFeaturedVideos,
  });

  // Fallback data for development or when Airtable is not yet connected
  const fallbackVideos: Property[] = [
    {
      id: 'v1',
      propertyAddress: '789 Ocean Drive',
      videoFile: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04',
      propertyDescription: 'Stunning oceanfront property with panoramic views',
      address: '789 Ocean Drive',
      bedrooms: 0,
      bathrooms: 0,
      price: 0,
      status: 'Active',
      city: 'Unknown City',
      state: 'Unknown State',
      zipCode: 'Unknown',
      squareFeet: 0,
      propertyType: 'Unknown',
      listingType: 'Unknown',
      imageUrl: ''
    },
    {
      id: 'v2',
      propertyAddress: '456 Mountain View',
      videoFile: 'https://images.unsplash.com/photo-1472396961693-142e6e269027',
      propertyDescription: 'Luxurious mountain retreat with private forest views',
      address: '456 Mountain View',
      bedrooms: 0,
      bathrooms: 0,
      price: 0,
      status: 'Active',
      city: 'Unknown City',
      state: 'Unknown State',
      zipCode: 'Unknown',
      squareFeet: 0,
      propertyType: 'Unknown',
      listingType: 'Unknown',
      imageUrl: ''
    },
    {
      id: 'v3',
      propertyAddress: '123 Sunset Boulevard',
      videoFile: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
      propertyDescription: 'Contemporary home in a peaceful neighborhood',
      address: '123 Sunset Boulevard',
      bedrooms: 0,
      bathrooms: 0,
      price: 0,
      status: 'Active',
      city: 'Unknown City',
      state: 'Unknown State',
      zipCode: 'Unknown',
      squareFeet: 0,
      propertyType: 'Unknown',
      listingType: 'Unknown',
      imageUrl: ''
    },
    {
      id: 'v4',
      propertyAddress: '321 River Road',
      videoFile: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      propertyDescription: 'Cozy riverfront property with private dock',
      address: '321 River Road',
      bedrooms: 0,
      bathrooms: 0,
      price: 0,
      status: 'Active',
      city: 'Unknown City',
      state: 'Unknown State',
      zipCode: 'Unknown',
      squareFeet: 0,
      propertyType: 'Unknown',
      listingType: 'Unknown',
      imageUrl: ''
    }
  ];

  const videosToDisplay = properties && properties.length > 0 ? properties : fallbackVideos;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="hero-section">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-6 text-center">Property Video Tours</h1>
          <p className="text-xl mb-8 text-center max-w-2xl mx-auto">
            Explore our properties through immersive video tours
          </p>
          <SearchBar />
        </div>
      </div>

      <div className="container-custom mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videosToDisplay.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative group">
                  <AspectRatio ratio={16/9}>
                    <img 
                      src={typeof property.videoFile === 'string' ? property.videoFile : 
                           property.videoFile && property.videoFile.length > 0 ? property.videoFile[0].url : 
                           'https://placehold.co/600x400?text=No+Video'} 
                      alt={property.propertyAddress || property.address} 
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
                    {property.propertyAddress || property.address}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {property.propertyDescription || property.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoListings;
