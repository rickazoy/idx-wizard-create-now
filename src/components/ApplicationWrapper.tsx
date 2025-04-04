
import React from 'react';
import NavigationBar from './NavigationBar';

interface ApplicationWrapperProps {
  children: React.ReactNode;
}

const ApplicationWrapper: React.FC<ApplicationWrapperProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default ApplicationWrapper;
