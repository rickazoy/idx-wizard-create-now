import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code } from 'lucide-react';
import ApiKeySettings from './ApiKeySettings';
import { getApiKey } from '@/services/api';
import TenantIdDisplay from './TenantIdDisplay';

const ApiIntegrationGuide = () => {
  const [activeTab, setActiveTab] = useState('url-params');
  const apiKey = getApiKey();

  return (
    <div className="space-y-6">
      <TenantIdDisplay />

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Code className="mr-2" /> API Integration Guide
          </CardTitle>
          <CardDescription>
            Configure and deploy new instances using n8n or other tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="url-params">URL Parameters</TabsTrigger>
              <TabsTrigger value="rest-api">REST API</TabsTrigger>
            </TabsList>
            
            <TabsContent value="url-params" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">URL Parameters Integration</h3>
                <p className="text-muted-foreground">
                  Pass configuration parameters directly via URL to initialize the application.
                  This is useful for quick setup or demo deployments.
                </p>
                
                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code className="text-xs sm:text-sm whitespace-pre-wrap break-all">
                    https://your-app-url.com/?tenantId=client123&appName=ClientApp&templateId=idx-wizard&idxApiKey=abc123&airtableApiKey=key123
                  </code>
                </div>
                
                <h4 className="font-medium mt-4">Supported Parameters</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li><strong>tenantId</strong>: Unique identifier for the tenant (required)</li>
                  <li><strong>idxApiKey</strong>: API Key for IDX integration</li>
                  <li><strong>idxOutputType</strong>: Output type for IDX API</li>
                  <li><strong>apiVersion</strong>: API version to use</li>
                  <li><strong>ancillaryKey</strong>: Ancillary key for additional services</li>
                  <li><strong>airtableApiKey</strong>: API Key for Airtable</li>
                  <li><strong>baseId</strong>: Airtable base ID</li>
                  <li><strong>agentFilter</strong>: Filter for listing agent</li>
                  <li><strong>agentName</strong>: Name of the agent</li>
                  <li><strong>agentBio</strong>: Biography of the agent</li>
                  <li><strong>agentPhoto</strong>: URL to agent's photo</li>
                  <li><strong>isAdmin</strong>: Set admin privileges (true/false)</li>
                  <li><strong>appName</strong>: Name of the deployed application</li>
                  <li><strong>templateId</strong>: ID of the template to use</li>
                </ul>
                
                <h4 className="font-medium mt-4">n8n Workflow Setup</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  See the REST API tab for a more robust implementation with n8n.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="rest-api" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">REST API Integration</h3>
                <p className="text-muted-foreground">
                  Use the REST API to programmatically configure and deploy new application instances.
                  This is ideal for automation with n8n workflows.
                </p>
                
                <ApiKeySettings />
                
                <div className="space-y-2 mt-6">
                  <h4 className="font-medium">API Endpoint</h4>
                  <div className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>POST /api/config</code>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Headers</h4>
                  <div className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code className="text-xs sm:text-sm">
                      Content-Type: application/json<br/>
                      X-API-Key: {apiKey ? '(your API key)' : 'Generate an API key above'}
                    </code>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Request Body Example</h4>
                  <div className="bg-muted p-4 rounded-md overflow-x-auto">
                    <pre className="text-xs sm:text-sm whitespace-pre-wrap">
{`{
  "tenantId": "client123",
  "configData": {
    "app_name": "Client Real Estate App",
    "template_id": "idx-wizard",
    "idx_api_key": "your_idx_api_key",
    "airtable_api_key": "your_airtable_key",
    "airtable_base_id": "your_base_id",
    "agent_name": "Jane Doe",
    "agent_photo": "https://example.com/photo.jpg"
  }
}`}
                    </pre>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">n8n Workflow Example</h4>
                  <p className="text-sm text-muted-foreground">
                    Here's how to set up an n8n workflow to create a new app instance:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2 text-sm">
                    <li>Add an HTTP Request node in n8n</li>
                    <li>Set the method to POST</li>
                    <li>Set the URL to: <code>https://your-app-url.com/api/config</code></li>
                    <li>Add header: <code>X-API-Key</code> with your API key</li>
                    <li>Add header: <code>Content-Type</code> with value <code>application/json</code></li>
                    <li>Set the JSON body as shown in the example above</li>
                  </ol>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Response Format</h4>
                  <div className="bg-muted p-4 rounded-md overflow-x-auto">
                    <pre className="text-xs sm:text-sm whitespace-pre-wrap">
{`{
  "success": true,
  "message": "Configuration updated successfully"
}`}
                    </pre>
                  </div>
                </div>
                
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 dark:bg-amber-950 dark:border-amber-600">
                  <h4 className="font-medium text-amber-800 dark:text-amber-300">Security Considerations</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    Store your API key securely. Don't share it in public repositories or client-side code.
                    For production use, consider implementing additional security measures like IP whitelisting.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiIntegrationGuide;
