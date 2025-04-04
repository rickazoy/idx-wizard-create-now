
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AgentFeature = () => {
  console.log("AgentFeature component loaded - current version");
  
  const [agentName, setAgentName] = useState('Adam Johnson');
  const [agentBio, setAgentBio] = useState(
    'Adam Johnson is a seasoned real estate agent specializing in luxury waterfront condos in Southeast Florida. With a deep knowledge of the region\'s most exclusive neighborhoods, Adam offers a wealth of expertise in navigating the high-end real estate market. His dedication to providing exceptional service, combined with his passion for waterfront living, has earned him a reputation for successfully matching discerning clients with their dream properties. Whether buying or selling, Adam\'s personalized approach ensures a smooth, informed experience every step of the way, making him a trusted advisor for those seeking the finest in coastal luxury living.'
  );
  const [agentPhoto, setAgentPhoto] = useState('/lovable-uploads/c100db66-1b93-4d30-9033-5dd71fcc3784.png');

  // Load agent information from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem('agent_name');
    const storedBio = localStorage.getItem('agent_bio');
    const storedPhoto = localStorage.getItem('agent_photo');

    if (storedName) setAgentName(storedName);
    if (storedBio) setAgentBio(storedBio);
    if (storedPhoto) setAgentPhoto(storedPhoto);
  }, []);

  return (
    <section className="bg-white py-16">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left side: Agent information */}
          <div className="flex-1 max-w-3xl">
            <h4 className="uppercase text-center lg:text-left text-sm tracking-wider text-gray-500 mb-3">ALWAYS THERE FOR YOU</h4>
            <h2 className="text-4xl md:text-5xl font-bold text-[#2374AB] text-center lg:text-left mb-6">{agentName}</h2>
            <p className="text-gray-700 mb-8 text-center lg:text-left">
              {agentBio}
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
          <div className="flex-1 flex justify-center lg:justify-end">
            <img 
              src={agentPhoto} 
              alt={`${agentName} - Real Estate Agent`} 
              className="w-auto h-auto max-h-[600px] object-contain rounded-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgentFeature;
