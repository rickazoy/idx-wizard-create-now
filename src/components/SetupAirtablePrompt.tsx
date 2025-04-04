
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database } from 'lucide-react';

interface SetupAirtablePromptProps {
  className?: string;
}

const SetupAirtablePrompt: React.FC<SetupAirtablePromptProps> = ({ className }) => {
  const isConfigured = localStorage.getItem('airtable_api_key') && localStorage.getItem('airtable_base_id');
  
  if (isConfigured) return null;
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Airtable Connection Required
        </CardTitle>
        <CardDescription>
          Connect your Airtable account to display real property listings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          You need to configure your Airtable API Token and Base ID to view real property data.
          Until configured, sample data will be displayed.
        </p>
        <div className="text-sm space-y-2 mb-4 bg-secondary/50 p-3 rounded-md">
          <p className="font-medium">How to find your Airtable information:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Create a Personal Access Token in your <a href="https://airtable.com/create/tokens" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Airtable account</a></li>
            <li>Copy your Base ID from the URL when viewing your base (starts with "app")</li>
            <li>Ensure your table is named "Property Management System Listings" with required fields</li>
          </ol>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link to="/settings">
            Configure Airtable
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SetupAirtablePrompt;
