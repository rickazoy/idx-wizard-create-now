
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Heart, BedDouble, Bath, Square } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: string;
  listingType: 'For Sale' | 'For Rent';
  imageUrl: string;
  description?: string;
  isIdxProperty?: boolean;
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
      <Link to={`/property/${property.id}`} className="block">
        <div className="relative">
          <AspectRatio ratio={4/3}>
            <img 
              src={property.imageUrl} 
              alt={property.address} 
              className="object-cover w-full h-full"
            />
          </AspectRatio>
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className={property.listingType === 'For Sale' ? 'bg-realestate-blue' : 'bg-realestate-teal'}>
              {property.listingType}
            </Badge>
            <Badge variant="outline" className="bg-white/90 text-realestate-darkgray">
              {property.propertyType}
            </Badge>
          </div>
          {property.isIdxProperty && (
            <Badge variant="outline" className="absolute top-3 right-12 bg-amber-500/90 text-white border-amber-500 font-medium">
              IDX
            </Badge>
          )}
          <button 
            className="absolute top-3 right-3 p-1.5 bg-white/80 hover:bg-white rounded-full text-gray-700 hover:text-red-500 transition-colors"
            aria-label="Favorite"
          >
            <Heart className="h-5 w-5" />
          </button>
        </div>
        <CardContent className="p-4">
          <div className="mb-2">
            <div className="text-xl font-semibold mb-1">{formatPrice(property.price)}</div>
            <div className="text-muted-foreground truncate">{property.address}</div>
            <div className="text-sm text-muted-foreground">{property.city}, {property.state} {property.zipCode}</div>
          </div>
          <div className="flex items-center justify-between mt-4 text-sm">
            <div className="flex items-center">
              <BedDouble className="h-4 w-4 mr-1" />
              <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span>{property.squareFeet.toLocaleString()} sqft</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default PropertyCard;
