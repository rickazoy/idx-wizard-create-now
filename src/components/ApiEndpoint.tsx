
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Server } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ApiEndpoint: React.FC = () => {
  const { toast } = useToast();
  const [tenantId, setTenantId] = useState(localStorage.getItem('tenantId') || '');
  
  // Generate the base URL for this application
  const baseUrl = window.location.origin;
  const exampleUrl = `${baseUrl}/?tenantId=${tenantId || 'your-tenant-id'}&idxApiKey=YOUR_IDX_API_KEY&airtableApiKey=YOUR_AIRTABLE_API_KEY&baseId=YOUR_BASE_ID`;
  
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(exampleUrl);
    toast({
      title: 'URL Copied',
      description: 'The example URL has been copied to your clipboard',
    });
  };
  
  const handleSaveTenantId = () => {
    if (tenantId) {
      localStorage.setItem('tenantId', tenantId);
      toast({
        title: 'Tenant ID Saved',
        description: 'The tenant ID has been saved and will be used for Airtable configuration',
      });
    } else {
      localStorage.removeItem('tenantId');
      toast({
        title: 'Tenant ID Cleared',
        description: 'The tenant ID has been removed',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          n8n API Integration
        </CardTitle>
        <CardDescription>
          Configure this application for automated deployment with n8n
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Your Tenant ID</h3>
          <div className="flex gap-2">
            <Input 
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              placeholder="Enter your tenant ID"
              className="flex-1"
            />
            <Button onClick={handleSaveTenantId}>
              Save
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            This ID links your application to the configuration stored in Airtable
          </p>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Example URL for n8n</h3>
          <div className="relative">
            <Input 
              value={exampleUrl}
              readOnly
              className="pr-10 font-mono text-xs"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0" 
              onClick={handleCopyUrl}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Use this URL format in your n8n workflow to configure the application via URL parameters
          </p>
        </div>
        
        <div className="bg-secondary/30 p-3 rounded-md space-y-2">
          <h3 className="text-sm font-medium">Available URL Parameters</h3>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li><code>tenantId</code> - Unique identifier for this instance</li>
            <li><code>idxApiKey</code> - IDX Broker API Key</li>
            <li><code>outputType</code> - IDX Output format (json, xml)</li>
            <li><code>apiVersion</code> - IDX API Version</li>
            <li><code>ancillaryKey</code> - IDX Ancillary Key</li>
            <li><code>airtableApiKey</code> - Airtable API Token</li>
            <li><code>baseId</code> - Airtable Base ID</li>
            <li><code>agentFilter</code> - Agent filter for properties</li>
            <li><code>agentName</code> - Agent display name</li>
            <li><code>agentBio</code> - Agent biography</li>
            <li><code>agentPhoto</code> - URL to agent photo</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiEndpoint;
