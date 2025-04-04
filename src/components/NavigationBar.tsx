
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

const NavigationBar: React.FC = () => {
  const isAdmin = localStorage.getItem('is_admin') === 'true';
  
  return (
    <nav className="border-b">
      <div className="container-custom flex items-center justify-between h-16">
        <div className="flex items-center">
          <Link to="/" className="font-semibold text-xl">Real Estate</Link>
          <div className="hidden md:flex ml-10 space-x-8">
            <Link to="/" className="text-gray-700 hover:text-black">Home</Link>
            <Link to="/listings" className="text-gray-700 hover:text-black">Properties</Link>
            <Link to="/videos" className="text-gray-700 hover:text-black">Videos</Link>
          </div>
        </div>
        
        {isAdmin && (
          <Button variant="ghost" size="icon" asChild>
            <Link to="/settings" title="Settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;
