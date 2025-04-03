
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

interface PropertyFilterProps {
  onFilterChange: (filters: FilterValues) => void;
}

export interface FilterValues {
  priceRange: [number, number];
  bedrooms: string;
  bathrooms: string;
  propertyType: string;
}

const PropertyFilter: React.FC<PropertyFilterProps> = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    priceRange: [0, 1000000],
    bedrooms: 'any',
    bathrooms: 'any',
    propertyType: 'any',
  });

  const handlePriceChange = (value: number[]) => {
    const newFilters = { 
      ...filters, 
      priceRange: [value[0], value[1]] as [number, number] 
    };
    setFilters(newFilters);
  };

  const handleSelectChange = (value: string, filterKey: keyof FilterValues) => {
    const newFilters = { ...filters, [filterKey]: value };
    setFilters(newFilters as FilterValues);
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      priceRange: [0, 1000000],
      bedrooms: 'any',
      bathrooms: 'any',
      propertyType: 'any',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">Filters</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
              <span className="ml-1">{isOpen ? 'Hide' : 'Show'}</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="mt-4 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Price Range</Label>
              <div className="text-sm text-muted-foreground">
                {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
              </div>
            </div>
            <Slider
              defaultValue={filters.priceRange}
              min={0}
              max={1000000}
              step={10000}
              onValueChange={handlePriceChange}
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Select
                value={filters.bedrooms}
                onValueChange={(value) => handleSelectChange(value, 'bedrooms')}
              >
                <SelectTrigger id="bedrooms">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Select
                value={filters.bathrooms}
                onValueChange={(value) => handleSelectChange(value, 'bathrooms')}
              >
                <SelectTrigger id="bathrooms">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type</Label>
              <Select
                value={filters.propertyType}
                onValueChange={(value) => handleSelectChange(value, 'propertyType')}
              >
                <SelectTrigger id="propertyType">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={handleResetFilters}>
              Reset
            </Button>
            <Button className="btn-primary" onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default PropertyFilter;
