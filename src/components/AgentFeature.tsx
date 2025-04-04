
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { getPrimaryAgent } from '@/services/airtable/agentService';
import { Loader2 } from 'lucide-react';

const AgentFeature = () => {
  const { toast } = useToast();
  
  // State for agent data
  const [agentData, setAgentData] = useState({
    name: '',
    bio: '',
    photo: ''
  });
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Load agent data function
  const loadAgentData = async () => {
    try {
      setIsLoading(true);
      
      // Get direct from Airtable
      const agent = await getPrimaryAgent();
      
      if (agent) {
        // Set agent data from Airtable
        setAgentData({
          name: agent.name,
          bio: agent.bio,
          photo: agent.photo || '/lovable-uploads/c100db66-1b93-4d30-9033-5dd71fcc3784.png'
        });
      } else {
        // Use fallback values if no agent data
        setAgentData({
          name: localStorage.getItem('agent_name') || 'Default Agent',
          bio: localStorage.getItem('agent_bio') || 'A seasoned real estate agent specializing in luxury properties.',
          photo: localStorage.getItem('agent_photo') || '/lovable-uploads/c100db66-1b93-4d30-9033-5dd71fcc3784.png'
        });
        
        toast({
          title: "Agent Data Fallback",
          description: "Using localStorage agent data, no agent found in Airtable.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error loading agent data:", error);
      
      // Set fallback values from localStorage instead of hardcoded values
      setAgentData({
        name: localStorage.getItem('agent_name') || 'Default Agent',
        bio: localStorage.getItem('agent_bio') || 'A seasoned real estate agent specializing in luxury properties.',
        photo: localStorage.getItem('agent_photo') || '/lovable-uploads/c100db66-1b93-4d30-9033-5dd71fcc3784.png'
      });
      
      // Show error toast
      toast({
        title: "Error Loading Agent",
        description: "Failed to load agent data from Airtable. Using localStorage fallback.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    // Force immediate load
    loadAgentData();
  }, []);

  return (
    <section className="bg-white py-16">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Left side: Agent information - Now centered on mobile */}
          <div className="flex-1 text-center lg:text-center">
            <h4 className="uppercase text-sm tracking-wider text-gray-500 mb-3">YOUR TRUSTED AGENT</h4>
            {isLoading ? (
              <div className="flex justify-center items-center py-6">
                <Loader2 className="h-8 w-8 animate-spin text-[#2374AB]" />
                <span className="ml-3">Loading agent data...</span>
              </div>
            ) : (
              <>
                <h2 className="text-4xl md:text-5xl font-bold text-[#2374AB] mb-6">
                  {agentData.name || 'Loading...'}
                </h2>
                <p className="text-gray-700 mb-8">
                  {agentData.bio || 'Loading agent bio...'}
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button asChild className="bg-[#2374AB] hover:bg-[#1a5a87] px-8">
                    <Link to="/contact">Contact</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-[#2374AB] text-[#2374AB] hover:bg-[#2374AB]/10">
                    <Link to="/team">Our Team</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
          
          {/* Right side: Agent photo - Shadow removed */}
          <div className="flex-shrink-0">
            {isLoading ? (
              <div className="w-[300px] h-[300px] flex items-center justify-center bg-gray-200 rounded-lg">
                <Loader2 className="h-12 w-12 animate-spin text-[#2374AB]" />
              </div>
            ) : (
              <img 
                src={agentData.photo} 
                alt={`${agentData.name} - Real Estate Agent`} 
                className="w-[300px] h-[300px] object-cover rounded-lg"
                onError={(e) => {
                  console.error("Image failed to load:", agentData.photo);
                  e.currentTarget.src = '/lovable-uploads/c100db66-1b93-4d30-9033-5dd71fcc3784.png';
                }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgentFeature;
