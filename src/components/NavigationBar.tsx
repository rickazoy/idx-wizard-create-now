
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings, Menu } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useQuery } from '@tanstack/react-query';
import { getAgentLogo } from '@/services/airtable';

const cities = ['Miami', 'Coral Gables', 'Doral', 'Miami Beach', 'Sunny Isles'];

const NavigationBar: React.FC = () => {
  const isAdmin = localStorage.getItem('is_admin') === 'true';
  const location = useLocation();
  
  const { data: logoUrl } = useQuery({
    queryKey: ['agentLogo'],
    queryFn: getAgentLogo,
  });
  
  return (
    <nav className="border-b">
      <div className="container-custom flex items-center justify-between h-16">
        {/* Logo now positioned at the far left */}
        <Link to="/" className="flex items-center mr-6">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt="Company Logo" 
              className="w-auto mr-2 object-contain"
              style={{ 
                width: '300px',
                height: 'auto',
                maxHeight: '64px' // Match the navbar height (h-16 = 64px)
              }}
            />
          ) : (
            <span className="font-semibold text-xl">Real Estate</span>
          )}
        </Link>
        
        <div className="flex items-center justify-between flex-1">
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink 
                    className={navigationMenuTriggerStyle()}
                    active={location.pathname === '/'}
                  >
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger>Properties</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-3 p-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/listings"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">All Properties</div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    {cities.map((city) => (
                      <li key={city}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={`/listings?search=${encodeURIComponent(city)}`}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{city}</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger>Contact</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-3 p-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/contact"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Contact Us</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Get in touch with our team
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/team"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Our Team</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Meet our real estate professionals
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <div className="flex items-center">
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col gap-4 mt-8">
                    <Link to="/" className="px-2 py-1 text-lg font-semibold">Home</Link>
                    <div>
                      <p className="px-2 py-1 text-lg font-semibold">Properties</p>
                      <div className="ml-4 flex flex-col gap-2 mt-1">
                        <Link to="/listings" className="px-2 py-1">All Properties</Link>
                        {cities.map((city) => (
                          <Link 
                            key={city}
                            to={`/listings?search=${encodeURIComponent(city)}`}
                            className="px-2 py-1"
                          >
                            {city}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="px-2 py-1 text-lg font-semibold">Contact</p>
                      <div className="ml-4 flex flex-col gap-2 mt-1">
                        <Link to="/contact" className="px-2 py-1">Contact Us</Link>
                        <Link to="/team" className="px-2 py-1">Our Team</Link>
                      </div>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
            
            {isAdmin && (
              <Button variant="ghost" size="icon" asChild>
                <Link to="/settings" title="Settings">
                  <Settings className="h-5 w-5" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
