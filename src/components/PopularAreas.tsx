
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

// Define the popular cities - these should match parts of addresses in Airtable
const popularCities = [
  { name: 'Miami', icon: <MapPin className="h-4 w-4" /> },
  { name: 'Doral', icon: <MapPin className="h-4 w-4" /> },
  { name: 'Coral Gables', icon: <MapPin className="h-4 w-4" /> },
  { name: 'Miami Beach', icon: <MapPin className="h-4 w-4" /> },
  { name: 'Sunny Isles', icon: <MapPin className="h-4 w-4" /> },
];

const PopularAreas: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Popular Areas</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          {popularCities.map((city) => (
            <li key={city.name}>
              <Link 
                to={`/listings?search=${encodeURIComponent(city.name)}`}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted text-sm transition-colors"
              >
                {city.icon}
                <span>{city.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default PopularAreas;
