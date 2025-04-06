import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { getConfigValue } from '@/services/config';

interface SetupIDXPromptProps {
  className?: string;
}

const SetupIDXPrompt: React.FC<SetupIDXPromptProps> = ({ className }) => {
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkConfiguration = async () => {
      try {
        // Check if IDX API key exists in our config
        const idxApiKey = getConfigValue('idx_api_key');
        setIsConfigured(idxApiKey !== null && idxApiKey.length > 0);
      } catch (error) {
        console.error('Error checking IDX configuration:', error);
        setIsConfigured(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkConfiguration();
  }, []);
  
  // Don't render while checking configuration
  if (loading) return null;
  
  // Don't render if IDX is configured
  if (isConfigured) return null;
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          IDX Broker Connection Required
        </CardTitle>
        <CardDescription>
          Connect your IDX Broker account to display MLS property listings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          You need to configure your IDX Broker API Key to display MLS property listings.
          Until configured, sample property data will be displayed.
        </p>
        <div className="text-sm space-y-2 mb-4 bg-secondary/50 p-3 rounded-md">
          <p className="font-medium">How to set up IDX Broker:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Obtain an API key from your IDX Broker account</li>
            <li>Enter your API key and optional settings in the IDX tab of the Settings page</li>
            <li>Once saved, MLS property listings will be available on your site</li>
          </ol>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link to="/settings?tab=idx">
            Configure IDX Broker
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SetupIDXPrompt;
