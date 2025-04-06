
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { getApiKey, setApiKey } from '@/services/api';
import { toast } from '@/components/ui/use-toast';
import { Copy, CheckCircle2 } from 'lucide-react';

const ApiKeySettings = () => {
  const [apiKey, setApiKeyState] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Load the API key on mount
    const key = getApiKey();
    setApiKeyState(key);
  }, []);

  const generateNewApiKey = () => {
    setGenerating(true);
    
    // Generate a random API key
    const randomBytes = new Uint8Array(24);
    window.crypto.getRandomValues(randomBytes);
    const newApiKey = Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Save the new API key
    setApiKey(newApiKey);
    setApiKeyState(newApiKey);
    setShowApiKey(true);
    setGenerating(false);
    
    toast({
      title: 'API Key Updated',
      description: 'A new API key has been generated successfully.',
    });
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    
    toast({
      title: 'Copied',
      description: 'API key copied to clipboard',
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Access</CardTitle>
        <CardDescription>
          Manage API access for external integrations like n8n.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="flex">
              <Input
                id="api-key"
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                readOnly
                className="flex-1"
              />
              <Button 
                variant="outline" 
                className="ml-2" 
                onClick={copyApiKey}
                disabled={!apiKey}
              >
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            {apiKey && (
              <Button
                variant="link"
                type="button"
                className="p-0 h-auto"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? 'Hide' : 'Show'} API Key
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={generateNewApiKey} 
          disabled={generating}
        >
          {generating ? 'Generating...' : 'Generate New API Key'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApiKeySettings;
