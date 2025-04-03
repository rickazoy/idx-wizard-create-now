
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
  History 
} from 'lucide-react';
import { Property } from '@/components/PropertyCard';

// Sample property data (same as in PropertyListings)
const sampleProperties: Property[] = [
  {
    id: '1',
    address: '123 Main Street',
    city: 'Beverly Hills',
    state: 'CA',
    zipCode: '90210',
    price: 1250000,
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2850,
    propertyType: 'House',
    listingType: 'For Sale',
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '2',
    address: '456 Ocean Drive',
    city: 'Malibu',
    state: 'CA',
    zipCode: '90265',
    price: 3750000,
    bedrooms: 5,
    bathrooms: 4.5,
    squareFeet: 4200,
    propertyType: 'House',
    listingType: 'For Sale',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '3',
    address: '789 Sunset Boulevard',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90046',
    price: 5500,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    propertyType: 'Apartment',
    listingType: 'For Rent',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '4',
    address: '101 Wilshire Blvd',
    city: 'Santa Monica',
    state: 'CA',
    zipCode: '90401',
    price: 875000,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1750,
    propertyType: 'Condo',
    listingType: 'For Sale',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '5',
    address: '222 Venice Beach',
    city: 'Venice',
    state: 'CA',
    zipCode: '90291',
    price: 3200,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 950,
    propertyType: 'Apartment',
    listingType: 'For Rent',
    imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '6',
    address: '333 Canyon Road',
    city: 'Bel Air',
    state: 'CA',
    zipCode: '90077',
    price: 7900000,
    bedrooms: 6,
    bathrooms: 7,
    squareFeet: 8500,
    propertyType: 'House',
    listingType: 'For Sale',
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1000&auto=format&fit=crop',
  },
];

// Additional property details for demo
interface PropertyDetails extends Property {
  description: string;
  features: string[];
  yearBuilt: number;
  lotSize: number;
  garage: number;
  propertyTax: number;
  hoaFees?: number;
  additionalPhotos: string[];
}

const extendedProperties: Record<string, PropertyDetails> = {
  '1': {
    ...sampleProperties[0],
    description: 'This stunning home in Beverly Hills offers luxury living at its finest. Featuring an open floor plan, gourmet kitchen, and a resort-style backyard with pool and spa. The home has been fully renovated with high-end finishes throughout.',
    features: [
      'Gourmet kitchen with stainless steel appliances',
      'Hardwood floors throughout',
      'Primary suite with walk-in closet',
      'Smart home technology',
      'Central air conditioning and heating',
      'Two-car garage',
      'In-ground swimming pool',
      'Outdoor entertainment area',
      'Landscaped garden',
      'Security system'
    ],
    yearBuilt: 2010,
    lotSize: 9500,
    garage: 2,
    propertyTax: 15625,
    additionalPhotos: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  '2': {
    ...sampleProperties[1],
    description: 'Breathtaking oceanfront property in Malibu with panoramic views from every room. This architectural masterpiece features floor-to-ceiling windows, a gourmet kitchen, and multiple outdoor living spaces to enjoy the coastal lifestyle.',
    features: [
      'Ocean views from every room',
      'Private beach access',
      'Chef\'s kitchen with high-end appliances',
      'Wine cellar',
      'Home theater',
      'Primary suite with private balcony',
      'Infinity pool and hot tub',
      'Outdoor kitchen and dining area',
      'Four-car garage',
      'Smart home technology throughout'
    ],
    yearBuilt: 2018,
    lotSize: 12000,
    garage: 4,
    propertyTax: 46875,
    additionalPhotos: [
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687644-c7f34b5f2f97?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  '3': {
    ...sampleProperties[2],
    description: 'Modern apartment on Sunset Boulevard in the heart of Los Angeles. This unit features a spacious open floor plan, updated kitchen with stainless steel appliances, in-unit laundry, and a private balcony with city views.',
    features: [
      'In-unit washer and dryer',
      'Stainless steel appliances',
      'Quartz countertops',
      'Private balcony',
      'Central air conditioning',
      'Walk-in closet',
      'Pet-friendly building',
      'Fitness center access',
      'Covered parking spot',
      'Secure building with intercom'
    ],
    yearBuilt: 2015,
    lotSize: 0,
    garage: 1,
    propertyTax: 0,
    hoaFees: 450,
    additionalPhotos: [
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598528644866-3215eb3e9771?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  '4': {
    ...sampleProperties[3],
    description: 'Bright and airy condo in Santa Monica, just steps from the beach and promenade. This unit features recently updated bathrooms, an open kitchen with breakfast bar, and a spacious balcony perfect for enjoying ocean breezes.',
    features: [
      'Recently renovated bathrooms',
      'Open concept kitchen',
      'Breakfast bar',
      'Spacious balcony',
      'In-unit laundry',
      'Secured underground parking',
      'Building amenities include pool and gym',
      'Walking distance to beach',
      'Close to shops and restaurants',
      'Pet-friendly building'
    ],
    yearBuilt: 2005,
    lotSize: 0,
    garage: 1,
    propertyTax: 10938,
    hoaFees: 550,
    additionalPhotos: [
      'https://images.unsplash.com/photo-1600566753104-685f4f24cb4d?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1565183997392-2f6f122e5912?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  '5': {
    ...sampleProperties[4],
    description: 'Charming apartment in the heart of Venice Beach. This cozy unit features an updated kitchen, large windows for plenty of natural light, and is just a short walk to the beach, canals, and Abbott Kinney Boulevard.',
    features: [
      'Updated kitchen',
      'Large windows with plenty of natural light',
      'Hardwood floors',
      'Assigned parking space',
      'On-site laundry',
      'Controlled access building',
      'Pet-friendly',
      'Bicycle storage',
      'Close to Venice Beach',
      'Walking distance to restaurants and shops'
    ],
    yearBuilt: 1990,
    lotSize: 0,
    garage: 1,
    propertyTax: 0,
    hoaFees: 250,
    additionalPhotos: [
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598528644824-89e39afc3903?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  '6': {
    ...sampleProperties[5],
    description: 'Luxurious estate in the prestigious Bel Air neighborhood. This magnificent property sits on a large lot with stunning city and canyon views. The home features a grand entryway, formal living and dining rooms, a chef\'s kitchen, home theater, wine cellar, and a spectacular primary suite.',
    features: [
      'Gated entrance with circular driveway',
      'Grand foyer with dual staircases',
      'Chef\'s kitchen with top-of-the-line appliances',
      'Home theater with state-of-the-art equipment',
      'Wine cellar and tasting room',
      'Primary suite with dual bathrooms and closets',
      'Private gym',
      'Elevator to all floors',
      'Resort-style pool with waterfall',
      'Outdoor kitchen and entertainment areas',
      'Tennis court',
      'Six-car garage'
    ],
    yearBuilt: 2016,
    lotSize: 32000,
    garage: 6,
    propertyTax: 98750,
    additionalPhotos: [
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687710-3cad7a18fc13?q=80&w=1000&auto=format&fit=crop'
    ]
  }
};

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('details');

  useEffect(() => {
    // Simulate API call to fetch property details
    setTimeout(() => {
      if (id && extendedProperties[id]) {
        setProperty(extendedProperties[id]);
      }
      setLoading(false);
    }, 300);
  }, [id]);

  if (loading) {
    return (
      <div className="container-custom py-12 text-center">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-96 bg-gray-200 rounded mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            asChild 
            className="mb-2"
          >
            <Link to="/listings">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Listings
            </Link>
          </Button>
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{property.address}</h1>
              <p className="text-gray-600">
                {property.city}, {property.state} {property.zipCode}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
            </div>
          </div>
        </div>

        {/* Main image */}
        <div className="relative rounded-lg overflow-hidden h-[400px] mb-6">
          <img 
            src={property.imageUrl} 
            alt={property.address} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Thumbnail images */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {property.additionalPhotos.map((photo, index) => (
            <div key={index} className="h-24 md:h-32 rounded overflow-hidden">
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
                        <div>
                          <p className="text-sm text-gray-500">Year Built</p>
                          <p className="font-medium">{property.yearBuilt}</p>
                        </div>
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
                        <div>
                          <p className="text-sm text-gray-500">Garage</p>
                          <p className="font-medium">{property.garage} Car</p>
                        </div>
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
                        {property.hoaFees !== undefined && (
                          <div>
                            <p className="text-sm text-gray-500">HOA Fees</p>
                            <p className="font-medium">{formatPrice(property.hoaFees)}/month</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="features" className="mt-0">
                    <h3 className="text-xl font-bold mb-4">Features & Amenities</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                      {property.features.map((feature, index) => (
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
                  <Button variant="outline" className="justify-start">Thu, Apr 4</Button>
                  <Button variant="outline" className="justify-start">Fri, Apr 5</Button>
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
