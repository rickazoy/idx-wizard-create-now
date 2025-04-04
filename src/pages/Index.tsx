
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/SearchBar';
import PropertyCard, { Property } from '@/components/PropertyCard';
import { ArrowRight, Building, Home, MapPin, Shield } from 'lucide-react';
import PropertyVideos from '@/components/PropertyVideos';
import AgentFeature from '@/components/AgentFeature';
import { useQuery } from '@tanstack/react-query';
import { fetchFeaturedProperties } from '@/services/airtable/propertyService';
import SetupAirtablePrompt from '@/components/SetupAirtablePrompt';
import PopularAreas from '@/components/PopularAreas';
import ApplicationWrapper from '@/components/ApplicationWrapper';

// Sample featured properties as fallback
const fallbackProperties: Property[] = [
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

// Define styles for the hero section with your uploaded image
const heroStyle = {
  backgroundImage: 'url("/lovable-uploads/a78bc615-416d-4e55-9763-e5f19ae0886a.png")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  padding: '8rem 0',
  position: 'relative' as 'relative',
};

const Index = () => {
  // Fetch featured properties from Airtable
  const { data: featuredProperties, isLoading, error } = useQuery({
    queryKey: ['featuredProperties'],
    queryFn: fetchFeaturedProperties,
  });

  const isAirtableConfigured = localStorage.getItem('airtable_api_key') && localStorage.getItem('airtable_base_id');
  const propertiesToDisplay = featuredProperties && featuredProperties.length > 0 ? featuredProperties : fallbackProperties;

  return (
    <ApplicationWrapper>
      <div className="min-h-screen flex flex-col">
        {/* Hero Section with your uploaded image background */}
        <section className="hero-section relative" style={heroStyle}>
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="container-custom relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                Find Your Dream Home
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 text-white">
                Search properties, get market insights, and find your perfect place.
              </p>
              <SearchBar />
              
              <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm">
                <Button variant="link" asChild className="text-white">
                  <Link to="/listings?type=for-sale">Homes for Sale</Link>
                </Button>
                <Button variant="link" asChild className="text-white">
                  <Link to="/listings?type=for-rent">Homes for Rent</Link>
                </Button>
                <Button variant="link" asChild className="text-white">
                  <Link to="/listings?type=new-construction">New Construction</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Agent Section */}
        <AgentFeature />

        {/* Featured Properties Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Featured Properties</h2>
                <p className="text-gray-600">Handpicked properties you might love</p>
              </div>
              <div className="flex items-center gap-4">
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
                <Button asChild className="mt-4 md:mt-0">
                  <Link to="/listings">
                    View All Properties
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading featured properties...</p>
              </div>
            ) : error && isAirtableConfigured ? (
              <div className="text-center py-8 text-red-500">
                <p>Error loading properties. Please check your Airtable connection.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {propertiesToDisplay.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We provide a complete service for the sale, purchase or rental of real estate.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="bg-realestate-blue/10 p-3 rounded-full inline-flex mb-4">
                  <Home className="h-6 w-6 text-realestate-blue" />
                </div>
                <h3 className="text-xl font-bold mb-2">Trusted Properties</h3>
                <p className="text-gray-600">
                  All our properties are verified and regularly updated to ensure accurate listings.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="bg-realestate-teal/10 p-3 rounded-full inline-flex mb-4">
                  <Building className="h-6 w-6 text-realestate-teal" />
                </div>
                <h3 className="text-xl font-bold mb-2">Wide Range of Properties</h3>
                <p className="text-gray-600">
                  From apartments to luxury homes, we have properties to match every need and budget.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="bg-realestate-blue/10 p-3 rounded-full inline-flex mb-4">
                  <Shield className="h-6 w-6 text-realestate-blue" />
                </div>
                <h3 className="text-xl font-bold mb-2">Secure Transactions</h3>
                <p className="text-gray-600">
                  Our expert agents ensure your property transaction is smooth and secure.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Areas Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Popular Areas</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore some of the most sought-after neighborhoods in South Florida
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Miami', count: 24, image: 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?q=80&w=1000&auto=format&fit=crop' },
                { name: 'Doral', count: 18, image: 'https://images.unsplash.com/photo-1622548331053-105252394d6f?q=80&w=1000&auto=format&fit=crop' },
                { name: 'Coral Gables', count: 32, image: 'https://images.unsplash.com/photo-1546636889-ba9fdd63583e?q=80&w=1000&auto=format&fit=crop' },
                { name: 'Miami Beach', count: 56, image: 'https://images.unsplash.com/photo-1535498730771-e735b998cd64?q=80&w=1000&auto=format&fit=crop' },
              ].map((area, index) => (
                <Link 
                  key={index} 
                  to={`/listings?search=${encodeURIComponent(area.name)}`}
                  className="relative overflow-hidden rounded-lg group h-64 block"
                >
                  <img 
                    src={area.image} 
                    alt={area.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 flex flex-col justify-end">
                    <h3 className="text-white text-xl font-bold">{area.name}</h3>
                    <div className="flex items-center text-white/90 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{area.count} Properties</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button asChild variant="outline">
                <Link to="/listings">
                  View All Areas
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Property Videos Section */}
        <PropertyVideos />

        {/* CTA Section */}
        <section className="py-16 bg-realestate-blue text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Home?</h2>
            <p className="max-w-2xl mx-auto mb-8">
              Whether you're looking to buy, rent, or sell, we're here to help you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                className="bg-white text-realestate-blue hover:bg-white/90 text-base px-8"
              >
                <Link to="/listings">Browse Properties</Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                className="text-white border-white hover:bg-white/10 text-base px-8"
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </ApplicationWrapper>
  );
};

export default Index;
