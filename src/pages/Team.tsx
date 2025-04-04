
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPrimaryAgent } from '@/services/airtable/agentService';
import { Loader2, Phone, Mail, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Team = () => {
  const { data: agent, isLoading, error } = useQuery({
    queryKey: ['agent'],
    queryFn: getPrimaryAgent,
  });

  return (
    <div className="container-custom py-16">
      <h1 className="text-4xl font-bold text-center mb-2 text-[#2374AB]">Our Team</h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Meet our experienced real estate professionals dedicated to helping you find your perfect property.
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#2374AB]" />
          <span className="ml-3">Loading team data...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">Error loading team data. Please try again later.</p>
          <Button asChild className="mt-4">
            <Link to="/settings">Configure Airtable</Link>
          </Button>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {agent ? (
            <Card className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5">
                  <img 
                    src={agent.photo || '/lovable-uploads/c100db66-1b93-4d30-9033-5dd71fcc3784.png'} 
                    alt={agent.name}
                    className="w-full h-full object-cover aspect-square"
                  />
                </div>
                <CardContent className="md:w-3/5 p-6">
                  <h2 className="text-2xl font-bold mb-2">{agent.name}</h2>
                  <p className="text-[#2374AB] font-medium mb-4">Lead Real Estate Agent</p>
                  
                  <Separator className="my-4" />
                  
                  <p className="mb-6 text-gray-700">{agent.bio}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" /> (555) 123-4567
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" /> {agent.name.toLowerCase().replace(/\s+/g, '.')}@realestate.com
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" /> Miami, FL
                    </div>
                  </div>
                  
                  <Button asChild className="mt-6 bg-[#2374AB] hover:bg-[#1a5a87]">
                    <Link to="/contact">Contact {agent.name.split(' ')[0]}</Link>
                  </Button>
                </CardContent>
              </div>
            </Card>
          ) : (
            <div className="text-center py-12">
              <p>No agent information available. Please configure your agent details.</p>
              <Button asChild className="mt-4">
                <Link to="/settings">Configure Agent</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Team;
