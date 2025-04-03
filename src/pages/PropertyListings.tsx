
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard, { Property } from '@/components/PropertyCard';
import PropertyFilter, { FilterValues } from '@/components/PropertyFilter';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Grid, List } from 'lucide-react';

// Sample property data
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

const PropertyListings: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'all' | 'for-sale' | 'for-rent'>('all');
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(sampleProperties);

  // Filter properties based on search term, tab, and filters
  const applyFilters = (filters: FilterValues) => {
    let result = sampleProperties;

    // Apply search filter if present
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (property) =>
          property.address.toLowerCase().includes(term) ||
          property.city.toLowerCase().includes(term) ||
          property.zipCode.includes(term)
      );
    }

    // Apply tab filter
    if (activeTab === 'for-sale') {
      result = result.filter((property) => property.listingType === 'For Sale');
    } else if (activeTab === 'for-rent') {
      result = result.filter((property) => property.listingType === 'For Rent');
    }

    // Apply price filter
    result = result.filter(
      (property) => 
        property.price >= filters.priceRange[0] && 
        property.price <= filters.priceRange[1]
    );

    // Apply bedroom filter
    if (filters.bedrooms !== 'any') {
      const minBedrooms = parseInt(filters.bedrooms);
      result = result.filter((property) => property.bedrooms >= minBedrooms);
    }

    // Apply bathroom filter
    if (filters.bathrooms !== 'any') {
      const minBathrooms = parseInt(filters.bathrooms);
      result = result.filter((property) => property.bathrooms >= minBathrooms);
    }

    // Apply property type filter
    if (filters.propertyType !== 'any') {
      result = result.filter(
        (property) => property.propertyType.toLowerCase() === filters.propertyType.toLowerCase()
      );
    }

    setFilteredProperties(result);
  };

  // Initialize with default filters
  useEffect(() => {
    applyFilters({
      priceRange: [0, 1000000],
      bedrooms: 'any',
      bathrooms: 'any',
      propertyType: 'any',
    });
  }, [searchTerm, activeTab]);

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">
          {searchTerm ? `Properties in "${searchTerm}"` : 'All Properties'}
        </h1>
        
        <div className="mb-6">
          <SearchBar compact />
        </div>

        <PropertyFilter onFilterChange={applyFilters} />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as 'all' | 'for-sale' | 'for-rent')}
            className="w-full sm:w-auto"
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="for-sale">For Sale</TabsTrigger>
              <TabsTrigger value="for-rent">For Rent</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="px-3"
            >
              <Grid className="h-4 w-4 mr-1" />
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="px-3"
            >
              <List className="h-4 w-4 mr-1" />
              List
            </Button>
          </div>
        </div>
      </div>

      {filteredProperties.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No properties found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filter criteria
          </p>
          <Button 
            onClick={() => {
              applyFilters({
                priceRange: [0, 1000000],
                bedrooms: 'any',
                bathrooms: 'any',
                propertyType: 'any',
              });
            }}
            variant="outline"
          >
            Reset filters
          </Button>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "flex flex-col gap-4"
        }>
          {filteredProperties.map((property) => (
            <PropertyCard 
              key={property.id} 
              property={property} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyListings;
