
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '@/components/PropertyCard';
import PropertyFilter, { FilterValues } from '@/components/PropertyFilter';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Grid, List } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProperties, getPropertiesForSale, Property } from '@/services/airtableService';
import { useToast } from '@/hooks/use-toast';

const PropertyListings: React.FC = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'all' | 'for-sale' | 'for-rent'>('all');
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);

  // Fetch properties from Airtable
  const { data: properties, isLoading: isLoadingAll, error: errorAll } = useQuery({
    queryKey: ['properties'],
    queryFn: getProperties,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch properties for sale for the 'for-sale' tab
  const { data: propertiesForSale, isLoading: isLoadingSale } = useQuery({
    queryKey: ['propertiesForSale'],
    queryFn: getPropertiesForSale,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: activeTab === 'for-sale',
  });

  // Show error toast if API requests fail
  useEffect(() => {
    if (errorAll) {
      toast({
        title: 'Error Loading Properties',
        description: 'Could not load properties from Airtable. Please check your connection settings.',
        variant: 'destructive',
      });
    }
  }, [errorAll, toast]);

  // Convert listingType string from Airtable to our expected format
  const normalizeListingType = (type: string): 'For Sale' | 'For Rent' => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('sale')) return 'For Sale';
    if (lowerType.includes('rent')) return 'For Rent';
    return 'For Sale'; // Default
  };

  // Filter properties based on search term, tab, and filters
  const applyFilters = (filters: FilterValues) => {
    // Choose the right data source based on active tab
    let dataSource: Property[] = [];
    
    if (activeTab === 'for-sale' && propertiesForSale) {
      dataSource = propertiesForSale;
    } else if (properties) {
      dataSource = properties;
    } else {
      dataSource = [];
    }

    let result = [...dataSource];

    // Apply search filter if present
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (property) =>
          property.address.toLowerCase().includes(term) ||
          (property.city && property.city.toLowerCase().includes(term)) ||
          (property.zipCode && property.zipCode.includes(term))
      );
    }

    // Apply tab filter for 'for-rent' (for-sale is already filtered at query level)
    if (activeTab === 'for-rent') {
      result = result.filter((property) => 
        normalizeListingType(property.listingType) === 'For Rent'
      );
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

  // Apply default filters when data loads or tab changes
  useEffect(() => {
    if (properties || propertiesForSale) {
      applyFilters({
        priceRange: [0, 10000000], // Higher default maximum
        bedrooms: 'any',
        bathrooms: 'any',
        propertyType: 'any',
      });
    }
  }, [properties, propertiesForSale, searchTerm, activeTab]);

  // Convert Property objects from Airtable to format expected by PropertyCard
  const formatPropertyForCard = (property: Property) => {
    return {
      ...property,
      listingType: normalizeListingType(property.listingType),
    };
  };

  const isLoading = isLoadingAll || isLoadingSale;

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
