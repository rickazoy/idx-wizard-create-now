
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Create new component with NO caching - completely rebuilt
const AgentFeature = () => {
  const { toast } = useToast();
  const timestamp = Date.now(); // Used to force browser to reload image
  
  // Don't use useState initial values that might get cached
  const [agentData, setAgentData] = useState({
    name: '',
    bio: '',
    photo: ''
  });
  
  // Debug function to display what we're actually loading
  const loadAgentData = () => {
    // Get direct from localStorage, no caching
    const name = localStorage.getItem('agent_name');
    const bio = localStorage.getItem('agent_bio');
    const photo = localStorage.getItem('agent_photo');
    
    console.log(`AGENT DATA DEBUG [${new Date().toISOString()}]:`, { 
      name, 
      bio: bio?.substring(0, 30) + "...", 
      photo,
      timestamp
    });
    
    // Set values with defaults if needed
    setAgentData({
      name: name || 'Default Agent',
      bio: bio || 'A seasoned real estate agent specializing in luxury properties.',
      photo: photo || '/lovable-uploads/c100db66-1b93-4d30-9033-5dd71fcc3784.png'
    });
    
    // Show toast for debugging
    toast({
      title: "Agent Data Loaded",
      description: `Loaded agent: ${name || 'Default agent'}`,
    });
  };

  // Load data when component mounts
  useEffect(() => {
    // Force immediate load
    loadAgentData();
    
    // Create an interval to check for changes every 500ms
    const intervalId = setInterval(() => {
      loadAgentData();
    }, 500);
    
    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="bg-white py-16" key={timestamp}>
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Left side: Agent information */}
          <div className="flex-1">
            <h4 className="uppercase text-center lg:text-left text-sm tracking-wider text-gray-500 mb-3">YOUR TRUSTED AGENT</h4>
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
          </div>
          
          {/* Right side: Agent photo with debug info displayed */}
          <div className="flex-shrink-0">
            <div className="relative">
              <img 
                src={`${agentData.photo}?nocache=${timestamp}`} 
                alt={`${agentData.name} - Real Estate Agent`} 
                className="w-[300px] h-[300px] object-cover rounded-lg shadow-md"
                onError={(e) => {
                  console.error("Image failed to load:", agentData.photo);
                  e.currentTarget.src = '/lovable-uploads/c100db66-1b93-4d30-9033-5dd71fcc3784.png?nocache=' + timestamp;
                }}
              />
              <div className="absolute top-0 left-0 bg-black/80 text-white text-xs p-1 rounded">
                Cache key: {timestamp}
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              <div>Last updated: {new Date().toLocaleTimeString()}</div>
              <div className="bg-amber-100 p-1 rounded mt-1 text-amber-800">
                Agent name in localStorage: {localStorage.getItem('agent_name') || 'Not set'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgentFeature;
