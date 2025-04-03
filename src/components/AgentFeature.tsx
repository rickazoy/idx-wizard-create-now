
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AgentFeature = () => {
  return (
    <section className="bg-white py-16">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1 order-2 lg:order-1">
            <div className="max-w-xl">
              <h4 className="uppercase text-sm tracking-wider text-gray-500 mb-3">ALWAYS THERE FOR YOU</h4>
              <h2 className="text-4xl md:text-5xl font-bold text-realestate-blue mb-6">ADAM JOHNSON</h2>
              <p className="text-gray-700 mb-8">
                Adam Johnson is a seasoned real estate agent specializing in luxury waterfront condos in Southeast Florida. 
                With a deep knowledge of the region's most exclusive neighborhoods, Adam offers a wealth of expertise in 
                navigating the high-end real estate market. His dedication to providing exceptional service, combined with 
                his passion for waterfront living, has earned him a reputation for successfully matching discerning clients 
                with their dream properties. Whether buying or selling, Adam's personalized approach ensures a smooth, 
                informed experience every step of the way, making him a trusted advisor for those seeking the finest in 
                coastal luxury living.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild>
                  <Link to="/team">Our Team</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/contact">Contact</Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1 order-1 lg:order-2">
            <img 
              src="/lovable-uploads/4e9be092-2789-475e-a191-9a1db783b58c.png" 
              alt="Adam Johnson - Real Estate Agent" 
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgentFeature;
