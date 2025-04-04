import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '@/components/PropertyCard';
import PropertyFilter, { FilterValues } from '@/components/PropertyFilter';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Grid, List } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProperties, Property } from '@/services/airtable/propertyService';
import { useToast } from '@/hooks/use-toast';
import PopularAreas from '@/components/PopularAreas';

const PropertyListings: React.FC = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'all' | 'for-sale' | 'for-rent'>('all');
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);

  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['properties'],
    queryFn: getProperties,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error Loading Properties',
        description: 'Could not load properties from Airtable. Please check your connection settings.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  const applyFilters = (filters: FilterValues) => {
    if (!properties) return;
    
    let result = [...properties];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (property) =>
          property.address.toLowerCase().includes(term) ||
          (property.city && property.city.toLowerCase().includes(term)) ||
          (property.zipCode && property.zipCode.includes(term))
      );
    }

    if (activeTab === 'for-sale') {
      result = result.filter((property) => 
        property.listingType.toLowerCase().includes('sale')
      );
    } else if (activeTab === 'for-rent') {
      result = result.filter((property) => 
        property.listingType.toLowerCase().includes('rent')
      );
    }

    result = result.filter(
      (property) => 
        property.price >= filters.priceRange[0] && 
        property.price <= filters.priceRange[1]
    );

    if (filters.bedrooms !== 'any') {
      const minBedrooms = parseInt(filters.bedrooms);
      result = result.filter((property) => property.bedrooms >= minBedrooms);
    }

    if (filters.bathrooms !== 'any') {
      const minBathrooms = parseInt(filters.bathrooms);
      result = result.filter((property) => property.bathrooms >= minBathrooms);
    }

    if (filters.propertyType !== 'any') {
      result = result.filter(
        (property) => property.propertyType.toLowerCase() === filters.propertyType.toLowerCase()
      );
    }

    setFilteredProperties(result);
  };

  useEffect(() => {
    if (properties) {
      applyFilters({
        priceRange: [0, 10000000],
        bedrooms: 'any',
        bathrooms: 'any',
        propertyType: 'any',
      });
    }
  }, [properties, searchTerm, activeTab]);

  const formatPropertyForCard = (property: Property) => {
    const normalizedListingType = property.listingType.toLowerCase().includes('sale') 
      ? 'For Sale' as const
      : 'For Rent' as const;
      
    return {
      ...property,
      listingType: normalizedListingType,
    };
  };

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">
          {searchTerm ? `Properties in "${searchTerm}"` : 'All Properties'}
        </h1>
        
        <div className="mb-6">
          <SearchBar compact />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="md:col-span-3">
            <PropertyFilter onFilterChange={applyFilters} />
          </div>
          <div className="md:col-span-1">
            <PopularAreas />
          </div>
        </div>

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

      {isLoading ? (
        <div className="text-center py-12">
          <p>Loading properties...</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No properties found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filter criteria
          </p>
          <Button 
            onClick={() => {
              applyFilters({
                priceRange: [0, 10000000],
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
              property={formatPropertyForCard(property)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyListings;
