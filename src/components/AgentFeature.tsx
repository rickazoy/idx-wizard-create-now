
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Force re-render by adding a key based on current time
const AgentFeature = () => {
  console.log("AgentFeature component loaded - TIMESTAMP VERSION:", new Date().toISOString());
  
  // Initialize state with direct localStorage values
  const [agentName, setAgentName] = useState(() => 
    localStorage.getItem('agent_name') || 'Adam Johnson'
  );
  
  const [agentBio, setAgentBio] = useState(() => 
    localStorage.getItem('agent_bio') || 'A seasoned real estate agent specializing in luxury properties.'
  );
  
  const [agentPhoto, setAgentPhoto] = useState(() => 
    localStorage.getItem('agent_photo') || '/lovable-uploads/c100db66-1b93-4d30-9033-5dd71fcc3784.png'
  );

  // Force refresh data on every render
  useEffect(() => {
    console.log("Forcing refresh of agent data...");
    
    // Direct assignment from localStorage with no caching
    const freshName = localStorage.getItem('agent_name');
    const freshBio = localStorage.getItem('agent_bio');
    const freshPhoto = localStorage.getItem('agent_photo');
    
    console.log("Fresh agent data from localStorage:", { 
      freshName, 
      freshBio: freshBio?.substring(0, 20) + "...", 
      freshPhoto 
    });

    if (freshName) setAgentName(freshName);
    if (freshBio) setAgentBio(freshBio);
    if (freshPhoto) setAgentPhoto(freshPhoto);
  }, []);

  return (
    <section className="bg-white py-16" key={Date.now()}>
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Left side: Agent information */}
          <div className="flex-1">
            <h4 className="uppercase text-center lg:text-left text-sm tracking-wider text-gray-500 mb-3">YOUR TRUSTED AGENT</h4>
            <h2 className="text-4xl md:text-5xl font-bold text-[#2374AB] text-center lg:text-left mb-6">
              {agentName || 'Loading...'}
            </h2>
            <p className="text-gray-700 mb-8 text-center lg:text-left">
              {agentBio || 'Loading agent bio...'}
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
          
          {/* Right side: Agent photo */}
          <div className="flex-shrink-0">
            <img 
              src={`${agentPhoto}?t=${Date.now()}`} 
              alt={`${agentName} - Real Estate Agent`} 
              className="w-[300px] h-[300px] object-cover rounded-lg shadow-md"
              onError={(e) => {
                console.error("Image failed to load:", agentPhoto);
                e.currentTarget.src = '/lovable-uploads/c100db66-1b93-4d30-9033-5dd71fcc3784.png';
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgentFeature;
