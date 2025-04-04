import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchFeaturedVideos, Property } from '@/services/airtable/propertyService';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Video, Loader2 } from 'lucide-react';

const PropertyVideos = () => {
  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['featuredVideos'],
    queryFn: fetchFeaturedVideos,
  });

  const fallbackVideos: Property[] = [
    {
      id: 'v1',
      propertyAddress: '789 Ocean Drive',
      videoFile: [],
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
      videoFile: [],
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
      videoFile: [],
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
      videoFile: [],
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
  const isAirtableConfigured = localStorage.getItem('airtable_api_key') && localStorage.getItem('airtable_base_id');

  const getVideoThumbnail = (property: Property) => {
    if (Array.isArray(property.videoFile) && property.videoFile.length > 0) {
      return property.videoFile[0].url;
    }
    return 'https://placehold.co/600x400?text=No+Video';
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container-custom text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4">Loading video tours...</p>
        </div>
      </section>
    );
  }

  if (error && isAirtableConfigured) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container-custom text-center">
          <p className="text-red-500">Error loading videos. Please check your Airtable connection.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Property Video Tours</h2>
            <p className="text-gray-600">
              Take a virtual tour of our exclusive properties
            </p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            {!isAirtableConfigured && (
              <Button 
                variant="outline"
                asChild
              >
                <Link to="/settings">
                  Configure Airtable
                </Link>
              </Button>
            )}
            <Button 
              asChild
            >
              <Link to="/videos">
                View All Videos
              </Link>
            </Button>
          </div>
        </div>

        <Carousel className="w-full">
          <CarouselContent>
            {videosToDisplay.map((property) => (
              <CarouselItem key={property.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="h-full">
                  <CardContent className="p-0">
                    <div className="relative group">
                      <AspectRatio ratio={16/9}>
                        <img 
                          src={getVideoThumbnail(property)} 
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
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {property.propertyDescription || property.description}
                      </p>
                      {property.listingAgent && (
                        <p className="text-xs text-gray-500 mt-2">
                          Agent: {property.listingAgent}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 lg:-left-12" />
          <CarouselNext className="right-2 lg:-right-12" />
        </Carousel>
      </div>
    </section>
  );
};

export default PropertyVideos;
