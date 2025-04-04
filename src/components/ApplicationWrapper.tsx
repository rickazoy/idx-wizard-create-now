
import React from 'react';
import NavigationBar from './NavigationBar';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

interface ApplicationWrapperProps {
  children: React.ReactNode;
}

const ApplicationWrapper: React.FC<ApplicationWrapperProps> = ({ children }) => {
  return (
    <>
      <NavigationBar />
      {children}
      <Toaster />
      <Sonner />
    </>
  );
};

export default ApplicationWrapper;
