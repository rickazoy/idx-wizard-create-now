import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApplicationWrapper from '@/components/ApplicationWrapper';
import IDXSettings from '@/components/IDXSettings';
import AirtableSettings from '@/components/AirtableSettings';
import AgentSettings from '@/components/AgentSettings';
import ApiIntegrationGuide from '@/components/ApiIntegrationGuide';

// Settings page component
const Settings = ({ initialTab }: { initialTab?: string }) => {
  return (
    <ApplicationWrapper>
      <div className="container mx-auto p-4 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <Tabs defaultValue={initialTab || "idx"} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="idx">IDX</TabsTrigger>
            <TabsTrigger value="airtable">Airtable</TabsTrigger>
            <TabsTrigger value="agent">Agent</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
          </TabsList>
          
          <TabsContent value="idx" className="space-y-6">
            <IDXSettings />
          </TabsContent>
          
          <TabsContent value="airtable" className="space-y-6">
            <AirtableSettings />
          </TabsContent>
          
          <TabsContent value="agent" className="space-y-6">
            <AgentSettings />
          </TabsContent>
          
          <TabsContent value="api" className="space-y-6">
            <ApiIntegrationGuide />
          </TabsContent>
        </Tabs>
      </div>
    </ApplicationWrapper>
  );
};

export default Settings;
