
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ApiEndpoint = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Integration Guide</CardTitle>
        <CardDescription>
          Use these endpoints to integrate with n8n or other automation tools
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important Integration Information</AlertTitle>
          <AlertDescription>
            This application provides URL parameter-based configuration for easy integration with n8n and other automation platforms.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="parameters" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="parameters">Configuration Parameters</TabsTrigger>
            <TabsTrigger value="n8n">n8n Integration</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>
          
          <TabsContent value="parameters" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Deployment Parameters</h3>
              <p className="text-sm text-muted-foreground">
                These parameters can be used to deploy and configure new instances of this application.
              </p>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parameter</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Example</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono">tenantId</TableCell>
                    <TableCell>Unique identifier for this deployment</TableCell>
                    <TableCell className="font-mono">client-123</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">appName</TableCell>
                    <TableCell>Name for the deployed application</TableCell>
                    <TableCell className="font-mono">Client Real Estate</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">templateId</TableCell>
                    <TableCell>ID of the template being used (current app)</TableCell>
                    <TableCell className="font-mono">idx-wizard-template</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">idxApiKey</TableCell>
                    <TableCell>IDX Broker API key</TableCell>
                    <TableCell className="font-mono">abc123...</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">outputType</TableCell>
                    <TableCell>IDX API output format</TableCell>
                    <TableCell className="font-mono">json</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">apiVersion</TableCell>
                    <TableCell>IDX API version</TableCell>
                    <TableCell className="font-mono">1.2.2</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">ancillaryKey</TableCell>
                    <TableCell>Optional ancillary key for IDX</TableCell>
                    <TableCell className="font-mono">xyz789...</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">airtableApiKey</TableCell>
                    <TableCell>Airtable API token</TableCell>
                    <TableCell className="font-mono">pat...</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">baseId</TableCell>
                    <TableCell>Airtable Base ID</TableCell>
                    <TableCell className="font-mono">app...</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">agentFilter</TableCell>
                    <TableCell>Filter by listing agent (optional)</TableCell>
                    <TableCell className="font-mono">John Smith</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">agentName</TableCell>
                    <TableCell>Featured agent name</TableCell>
                    <TableCell className="font-mono">Jane Doe</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">agentBio</TableCell>
                    <TableCell>Featured agent biography</TableCell>
                    <TableCell className="font-mono">Real estate expert...</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">agentPhoto</TableCell>
                    <TableCell>URL to agent's photo</TableCell>
                    <TableCell className="font-mono">https://...</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">isAdmin</TableCell>
                    <TableCell>Enable admin features</TableCell>
                    <TableCell className="font-mono">true</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="n8n" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">n8n Authentication & Configuration</h3>
              
              <Alert className="mb-4">
                <Info className="h-4 w-4" />
                <AlertTitle>About n8n Integration</AlertTitle>
                <AlertDescription>
                  n8n is a workflow automation tool that can be used to deploy and configure this application. The steps below will help you set up an n8n workflow to authenticate and update configuration values.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <h4 className="text-md font-medium">Step 1: Create an n8n Workflow</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Start by creating a new workflow in your n8n instance.</p>
                </div>
                
                <h4 className="text-md font-medium">Step 2: Add an HTTP Request Node</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Add an HTTP Request node with the following configuration:</p>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    <li>Method: <span className="font-mono">GET</span></li>
                    <li>URL: <span className="font-mono">https://your-app-url.com/</span></li>
                    <li>Authentication: <span className="font-mono">None</span> (authentication is handled via URL parameters)</li>
                  </ul>
                </div>
                
                <h4 className="text-md font-medium">Step 3: Add URL Parameters</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Add the following Query Parameters to your HTTP Request:</p>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    <li><span className="font-mono">tenantId</span>: Required - Unique identifier for this client/deployment</li>
                    <li><span className="font-mono">appName</span>: The name for the new deployed application</li>
                    <li><span className="font-mono">templateId</span>: ID to reference this app as the template</li>
                    <li><span className="font-mono">airtableApiKey</span>: Personal Access Token for Airtable</li>
                    <li><span className="font-mono">baseId</span>: Airtable Base ID</li>
                    <li>...and any other configuration parameters you need</li>
                  </ul>
                </div>
                
                <h4 className="text-md font-medium">Step 4: Configure Storage & Airtable Updates</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>When the URL is accessed with the appropriate parameters:</p>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    <li>Each parameter will be stored in localStorage for immediate use</li>
                    <li>Values will be written to the 'Lovable' table in Airtable for persistence</li>
                    <li>A new record will be created if the tenantId doesn't exist yet</li>
                    <li>Existing records will be updated if the tenantId already exists</li>
                  </ul>
                </div>
                
                <h4 className="text-md font-medium">Step 5: Lovable Template System Integration</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>To create new applications based on this template:</p>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    <li>Set <span className="font-mono">templateId</span> to a value that identifies this app as the template</li>
                    <li>Set <span className="font-mono">appName</span> to specify the name of the new deployment</li>
                    <li>Ensure <span className="font-mono">tenantId</span> is unique for each deployment</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-md mt-4">
                  <h4 className="font-medium text-blue-800 mb-2">Security Considerations</h4>
                  <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
                    <li>API tokens and sensitive information are passed via URL parameters</li>
                    <li>Consider using environment variables in n8n to store sensitive values</li>
                    <li>Use HTTPS to encrypt data in transit</li>
                    <li>Implement additional authentication if needed for production use</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="examples" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Example Usage</h3>
              <div className="p-4 bg-muted rounded-md">
                <pre className="text-xs overflow-auto whitespace-pre-wrap">
                  https://your-app-url.com/?tenantId=client123&appName=Client%20Real%20Estate&templateId=idx-wizard&idxApiKey=abc123&airtableApiKey=pat123&baseId=app123&agentName=Jane%20Doe
                </pre>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                This URL will initialize the application with the specified configuration parameters.
              </p>
            </div>
            
            <div className="space-y-2 mt-6">
              <h3 className="text-lg font-medium">n8n Example Workflow</h3>
              <div className="p-4 bg-muted rounded-md">
                <pre className="text-xs overflow-auto whitespace-pre-wrap">
{`// n8n Workflow JSON Example (Simplified)
{
  "nodes": [
    {
      "parameters": {
        "method": "GET",
        "url": "https://your-app-url.com/",
        "queryParameters": {
          "parameters": [
            {
              "name": "tenantId",
              "value": "client-{{$json.clientId}}"
            },
            {
              "name": "appName",
              "value": "{{$json.clientName}} Real Estate"
            },
            {
              "name": "templateId",
              "value": "idx-wizard-template"
            },
            {
              "name": "airtableApiKey",
              "value": "{{$env.AIRTABLE_PAT}}"
            },
            {
              "name": "baseId",
              "value": "{{$env.AIRTABLE_BASE_ID}}"
            },
            {
              "name": "agentName",
              "value": "{{$json.agentName}}"
            }
          ]
        }
      },
      "name": "Deploy Real Estate App",
      "type": "n8n-nodes-base.httpRequest",
      "id": "1"
    }
  ]
}`}
                </pre>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                This example shows how to structure an n8n workflow that deploys a new instance of your application with dynamic parameters.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">n8n Integration Tips</h3>
              <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                <li>Use the HTTP Request node to call this URL with your parameters</li>
                <li>Set up dynamic parameters based on your client data</li>
                <li>Add the URL to your deployment workflow</li>
                <li>Use the template system by setting the templateId parameter to reference this app</li>
                <li>Store API keys and tokens as environment variables in n8n</li>
                <li>Set up error handling to catch and respond to any deployment issues</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ApiEndpoint;
