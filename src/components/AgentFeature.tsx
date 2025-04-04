
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AgentFeature = () => {
  const [agentName, setAgentName] = useState('Adam Johnson');
  const [agentBio, setAgentBio] = useState(
    'Adam Johnson is a seasoned real estate agent specializing in luxury waterfront condos in Southeast Florida. With a deep knowledge of the region\'s most exclusive neighborhoods, Adam offers a wealth of expertise in navigating the high-end real estate market. His dedication to providing exceptional service, combined with his passion for waterfront living, has earned him a reputation for successfully matching discerning clients with their dream properties. Whether buying or selling, Adam\'s personalized approach ensures a smooth, informed experience every step of the way, making him a trusted advisor for those seeking the finest in coastal luxury living.'
  );
  const [agentPhoto, setAgentPhoto] = useState('/lovable-uploads/176200ee-5ba2-4fb0-af34-13fc98eb8fa5.png');

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
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1 order-2 lg:order-1 max-w-3xl">
            <h4 className="uppercase text-center lg:text-left text-sm tracking-wider text-gray-500 mb-3">ALWAYS THERE FOR YOU</h4>
            <h2 className="text-4xl md:text-5xl font-bold text-[#2374AB] text-center lg:text-left mb-6">{agentName}</h2>
            <p className="text-gray-700 mb-8 text-center lg:text-left">
              {agentBio}
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button asChild className="bg-[#2374AB] hover:bg-[#1a5a87] px-8">
                <Link to="/team">Our Team</Link>
              </Button>
              <Button asChild variant="outline" className="border-[#2374AB] text-[#2374AB] hover:bg-[#2374AB]/10 px-8">
                <Link to="/contact">Contact</Link>
              </Button>
            </div>
          </div>
          <div className="flex-1 order-1 lg:order-2">
            <img 
              src={agentPhoto} 
              alt={`${agentName} - Real Estate Agent`} 
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgentFeature;
