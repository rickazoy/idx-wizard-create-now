
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchFeaturedVideos } from '@/services/airtableService';
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
import { Video } from 'lucide-react';

const PropertyVideos = () => {
  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['featuredVideos'],
    queryFn: fetchFeaturedVideos,
  });

  // Fallback data for development or when Airtable is not yet connected
  const fallbackVideos = [
    {
      id: 'v1',
      propertyAddress: '789 Ocean Drive',
      videoFile: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04',
      propertyDescription: 'Stunning oceanfront property with panoramic views'
    },
    {
      id: 'v2',
      propertyAddress: '456 Mountain View',
      videoFile: 'https://images.unsplash.com/photo-1472396961693-142e6e269027',
      propertyDescription: 'Luxurious mountain retreat with private forest views'
    },
    {
      id: 'v3',
      propertyAddress: '123 Sunset Boulevard',
      videoFile: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
      propertyDescription: 'Contemporary home in a peaceful neighborhood'
    },
    {
      id: 'v4',
      propertyAddress: '321 River Road',
      videoFile: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      propertyDescription: 'Cozy riverfront property with private dock'
    }
  ];

  const videosToDisplay = properties?.length ? properties : fallbackVideos;

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
          <Button 
            asChild
            className="mt-4 md:mt-0"
          >
            <Link to="/videos">
              View All Videos
            </Link>
          </Button>
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
                          src={property.videoFile} 
                          alt={property.propertyAddress} 
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
                        {property.propertyAddress}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {property.propertyDescription}
                      </p>
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
