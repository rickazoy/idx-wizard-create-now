import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
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

// Add documentation for the new parameters for app name and template ID
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
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">n8n Integration Tips</h3>
          <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
            <li>Use the HTTP Request node to call this URL with your parameters</li>
            <li>Set up dynamic parameters based on your client data</li>
            <li>Add the URL to your deployment workflow</li>
            <li>Use the template system by setting the templateId parameter to reference this app</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiEndpoint;
