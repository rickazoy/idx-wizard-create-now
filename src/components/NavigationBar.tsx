
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
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

const cities = ['Miami', 'Coral Gables', 'Doral', 'Miami Beach', 'Sunny Isles'];

const NavigationBar: React.FC = () => {
  const isAdmin = localStorage.getItem('is_admin') === 'true';
  const location = useLocation();
  
  return (
    <nav className="border-b">
      <div className="container-custom flex items-center justify-between h-16">
        <div className="flex items-center">
          <Link to="/" className="font-semibold text-xl">Real Estate</Link>
          
          <NavigationMenu className="ml-10 hidden md:flex">
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
                <Link to="/videos">
                  <NavigationMenuLink 
                    className={navigationMenuTriggerStyle()}
                    active={location.pathname === '/videos'}
                  >
                    Videos
                  </NavigationMenuLink>
                </Link>
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
