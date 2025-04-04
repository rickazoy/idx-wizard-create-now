
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { getPrimaryAgent } from '@/services/airtableService';
import { Loader2 } from 'lucide-react';

// Create new component with NO caching
const AgentFeature = () => {
  const { toast } = useToast();
  const timestamp = Date.now(); // Used to force browser to reload image
  
  // State for agent data
  const [agentData, setAgentData] = useState({
    name: '',
    bio: '',
    photo: ''
  });
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // Debug function to display what we're actually loading
  const loadAgentData = async () => {
    try {
      setIsLoading(true);
      
      // Get direct from Airtable
      const agent = await getPrimaryAgent();
      
      console.log(`AGENT DATA FROM AIRTABLE [${new Date().toISOString()}]:`, { 
        agent,
        timestamp
      });
      
      if (agent) {
        // Set agent data from Airtable
        setAgentData({
          name: agent.name || 'Default Agent',
          bio: agent.bio || 'A seasoned real estate agent specializing in luxury properties.',
          photo: agent.photo || '/lovable-uploads/c100db66-1b93-4d30-9033-5dd71fcc3784.png'
        });
        
        setLoadError(null);
        
        // Show toast for debugging
        toast({
          title: "Agent Data Loaded",
          description: `Loaded agent: ${agent.name} from Airtable`,
        });
      } else {
        // Use fallback values if no agent data
        setAgentData({
          name: 'Default Agent',
          bio: 'A seasoned real estate agent specializing in luxury properties.',
          photo: '/lovable-uploads/c100db66-1b93-4d30-9033-5dd71fcc3784.png'
        });
        
        setLoadError("No agent found in Airtable");
        
        toast({
          title: "Agent Data Fallback",
          description: "Using default agent data, no agent found in Airtable.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error loading agent data:", error);
      
      // Set fallback values
      setAgentData({
        name: 'Default Agent',
        bio: 'A seasoned real estate agent specializing in luxury properties.',
        photo: '/lovable-uploads/c100db66-1b93-4d30-9033-5dd71fcc3784.png'
      });
      
      setLoadError(error instanceof Error ? error.message : "Unknown error");
      
      // Show error toast
      toast({
        title: "Error Loading Agent",
        description: "Failed to load agent data from Airtable.",
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
    
    // Create an interval to check for changes every 30 seconds
    const intervalId = setInterval(() => {
      setLoadAttempt(prev => prev + 1);
    }, 30000);
    
    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);
  
  // Reload when loadAttempt changes
  useEffect(() => {
    if (loadAttempt > 0) {
      loadAgentData();
    }
  }, [loadAttempt]);

  return (
    <section className="bg-white py-16" key={timestamp}>
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Left side: Agent information */}
          <div className="flex-1">
            <h4 className="uppercase text-center lg:text-left text-sm tracking-wider text-gray-500 mb-3">YOUR TRUSTED AGENT</h4>
            {isLoading ? (
              <div className="flex justify-center items-center py-6">
                <Loader2 className="h-8 w-8 animate-spin text-[#2374AB]" />
                <span className="ml-3">Loading agent data...</span>
              </div>
            ) : (
              <>
                <h2 className="text-4xl md:text-5xl font-bold text-[#2374AB] text-center lg:text-left mb-6">
                  {agentData.name || 'Loading...'}
                </h2>
                <p className="text-gray-700 mb-8 text-center lg:text-left">
                  {agentData.bio || 'Loading agent bio...'}
                </p>
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
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
          
          {/* Right side: Agent photo with debug info displayed */}
          <div className="flex-shrink-0">
            <div className="relative">
              {isLoading ? (
                <div className="w-[300px] h-[300px] flex items-center justify-center bg-gray-200 rounded-lg">
                  <Loader2 className="h-12 w-12 animate-spin text-[#2374AB]" />
                </div>
              ) : (
                <img 
                  src={`${agentData.photo}?nocache=${timestamp}`} 
                  alt={`${agentData.name} - Real Estate Agent`} 
                  className="w-[300px] h-[300px] object-cover rounded-lg shadow-md"
                  onError={(e) => {
                    console.error("Image failed to load:", agentData.photo);
                    e.currentTarget.src = '/lovable-uploads/c100db66-1b93-4d30-9033-5dd71fcc3784.png?nocache=' + timestamp;
                  }}
                />
              )}
              <div className="absolute top-0 left-0 bg-black/80 text-white text-xs p-1 rounded">
                Cache key: {timestamp}
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              <div>Last updated: {new Date().toLocaleTimeString()}</div>
              {loadError && (
                <div className="bg-red-100 p-1 rounded mt-1 text-red-800">
                  Error: {loadError}
                </div>
              )}
              <div className="bg-amber-100 p-1 rounded mt-1 text-amber-800">
                Data source: Airtable 'Agents' table
              </div>
              <div className="bg-blue-100 p-1 rounded mt-1 text-blue-800">
                Airtable configured: {getApiKey() && getBaseId() ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgentFeature;

function getApiKey() {
  return localStorage.getItem('airtable_api_key') || '';
}

function getBaseId() {
  return localStorage.getItem('airtable_base_id') || '';
}
