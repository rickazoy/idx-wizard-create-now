import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContactForm from '@/components/ContactForm';
import { 
  Home, 
  MapPin, 
  BedDouble, 
  Bath, 
  Square, 
  Calendar, 
  Heart, 
  Share, 
  ArrowLeft,
  Printer,
  History,
  Loader2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getPropertyById } from '@/services/airtable/propertyService';
import { useToast } from '@/hooks/use-toast';

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedTab, setSelectedTab] = useState('details');
  const { toast } = useToast();

  // Use React Query to fetch property details
  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: () => id ? getPropertyById(id) : null,
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error Loading Property',
        description: 'Could not load property details from Airtable.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="container-custom py-12 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-4">Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container-custom py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
        <p className="mb-6">The property you are looking for could not be found.</p>
        <Button asChild>
          <Link to="/listings">View All Properties</Link>
        </Button>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const fullAddress = `${property.address}, ${property.city}, ${property.state} ${property.zipCode}`;
  
  // Get additional images from property.images if available
  const additionalImages = property.images && property.images.length > 1 
    ? property.images.slice(1, 4).map(img => img.url) 
    : [];
  
  // If we don't have enough additional images, add placeholders
  while (additionalImages.length < 3) {
    additionalImages.push(`https://placehold.co/600x400?text=No+Image+${additionalImages.length + 1}`);
  }

  // Ensure features is an array
  const propertyFeatures = Array.isArray(property.features) ? property.features : [];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Background Image Section */}
      <div className="relative h-[40vh] bg-cover bg-center" 
        style={{ backgroundImage: 'url(/lovable-uploads/1f810f1f-efd4-4d2e-87d4-f11c9ef314ca.png)' }}>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container-custom py-6 relative z-10 h-full flex flex-col justify-end">
          <div className="mb-6 text-white">
            <Button 
              variant="outline" 
              size="sm" 
              asChild 
              className="mb-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/40 text-white"
            >
              <Link to="/listings">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Listings
              </Link>
            </Button>
            
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">{property.address}</h1>
                <p className="text-white/90 drop-shadow">
                  {property.city}, {property.state} {property.zipCode}
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex gap-2">
                <Button variant="outline" size="sm" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/40 text-white">
                  <Heart className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button variant="outline" size="sm" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/40 text-white">
                  <Share className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button variant="outline" size="sm" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/40 text-white">
                  <Printer className="h-4 w-4 mr-1" />
                  Print
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Main image */}
        <div className="relative rounded-lg overflow-hidden h-[400px] mb-6 shadow-lg">
          <img 
            src={property.imageUrl} 
            alt={property.address} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Thumbnail images */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {additionalImages.map((photo, index) => (
            <div key={index} className="h-24 md:h-32 rounded overflow-hidden shadow">
              <img 
                src={photo} 
                alt={`${property.address} - photo ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">
                    {formatPrice(property.price)}
                    {property.listingType === 'For Rent' && <span className="text-lg font-normal">/month</span>}
                  </h2>
                  <div className="flex gap-4 mt-2">
                    <div className="flex items-center">
                      <BedDouble className="h-5 w-5 mr-1 text-realestate-blue" />
                      <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-5 w-5 mr-1 text-realestate-blue" />
                      <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
                    </div>
                    <div className="flex items-center">
                      <Square className="h-5 w-5 mr-1 text-realestate-blue" />
                      <span>{property.squareFeet.toLocaleString()} sqft</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center px-3 py-1.5 bg-realestate-blue/10 text-realestate-blue rounded-full">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="font-semibold">{property.propertyType}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="w-full border-b flex">
                  <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                  <TabsTrigger value="features" className="flex-1">Features</TabsTrigger>
                </TabsList>
                <div className="p-6">
                  <TabsContent value="details" className="space-y-6 mt-0">
                    <div>
                      <h3 className="text-xl font-bold mb-4">Description</h3>
                      <p className="text-gray-700 whitespace-pre-line">
                        {property.description}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold mb-4">Property Details</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Property Type</p>
                          <p className="font-medium">{property.propertyType}</p>
                        </div>
                        {property.yearBuilt > 0 && (
                          <div>
                            <p className="text-sm text-gray-500">Year Built</p>
                            <p className="font-medium">{property.yearBuilt}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-gray-500">Square Feet</p>
                          <p className="font-medium">{property.squareFeet.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Bedrooms</p>
                          <p className="font-medium">{property.bedrooms}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Bathrooms</p>
                          <p className="font-medium">{property.bathrooms}</p>
                        </div>
                        {property.garage > 0 && (
                          <div>
                            <p className="text-sm text-gray-500">Garage</p>
                            <p className="font-medium">{property.garage} Car</p>
                          </div>
                        )}
                        {property.lotSize > 0 && (
                          <div>
                            <p className="text-sm text-gray-500">Lot Size</p>
                            <p className="font-medium">{property.lotSize.toLocaleString()} sqft</p>
                          </div>
                        )}
                        {property.propertyTax > 0 && (
                          <div>
                            <p className="text-sm text-gray-500">Property Tax</p>
                            <p className="font-medium">{formatPrice(property.propertyTax)}/year</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="features" className="mt-0">
                    <h3 className="text-xl font-bold mb-4">Features & Amenities</h3>
                    {propertyFeatures.length > 0 ? (
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                        {propertyFeatures.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <div className="bg-realestate-teal/20 text-realestate-teal rounded-full p-1 mr-2 mt-0.5">
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No features listed for this property.</p>
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Contact Agent</h3>
                <ContactForm 
                  propertyId={property.id}
                  propertyAddress={fullAddress}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-realestate-blue" />
                  <h3 className="text-xl font-bold">Schedule a Tour</h3>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <Button variant="outline" className="justify-start">Today</Button>
                  <Button variant="outline" className="justify-start">Tomorrow</Button>
                  <Button variant="outline" className="justify-start">
                    {new Date(Date.now() + 2*24*60*60*1000).toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'})}
                  </Button>
                  <Button variant="outline" className="justify-start">
                    {new Date(Date.now() + 3*24*60*60*1000).toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'})}
                  </Button>
                </div>
                <Button className="btn-primary w-full">Request a Tour</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
