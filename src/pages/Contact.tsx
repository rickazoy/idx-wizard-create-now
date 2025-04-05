
import React from 'react';
import ContactForm from '@/components/ContactForm';
import ApplicationWrapper from '@/components/ApplicationWrapper';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <ApplicationWrapper>
      <div className="min-h-screen">
        <section className="bg-realestate-blue text-white py-16">
          <div className="container-custom">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Contact Us</h1>
            <p className="text-xl text-center max-w-2xl mx-auto">
              We're here to help with all your real estate needs. Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="md:col-span-1 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
                  <p className="text-gray-600">
                    Have questions about a listing or need guidance in your real estate journey? 
                    Our team is ready to assist you.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-realestate-blue mr-3 mt-1" />
                    <div>
                      <h3 className="font-medium">Call Us</h3>
                      <p className="text-gray-600">(305) 555-1234</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-realestate-blue mr-3 mt-1" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-gray-600">info@southfloridarealty.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-realestate-blue mr-3 mt-1" />
                    <div>
                      <h3 className="font-medium">Office Location</h3>
                      <p className="text-gray-600">
                        123 Palm Avenue, Suite 200<br />
                        Miami, FL 33139
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Office Hours</h3>
                  <p className="text-gray-600">Monday - Friday: 9am - 6pm</p>
                  <p className="text-gray-600">Saturday: 10am - 4pm</p>
                  <p className="text-gray-600">Sunday: By appointment</p>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </div>
    </ApplicationWrapper>
  );
};

export default Contact;
