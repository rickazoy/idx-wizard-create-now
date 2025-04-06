
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { getConfigValue, setConfigValue } from '@/services/config';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getBase } from '@/services/airtable/airtableCore';

interface ApiVersion {
  id: string;
  version: string;
}

const IDXSettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [outputType, setOutputType] = useState('');
  const [apiVersion, setApiVersion] = useState('');
  const [ancillaryKey, setAncillaryKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [apiVersions, setApiVersions] = useState<ApiVersion[]>([]);
  
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        // Load settings from config service
        const storedApiKey = getConfigValue('idx_api_key');
        const storedOutputType = getConfigValue('idx_output_type');
        const storedApiVersion = getConfigValue('api_version');
        const storedAncillaryKey = getConfigValue('ancillary_key');
        
        setApiKey(storedApiKey || '');
        setOutputType(storedOutputType || '');
        setApiVersion(storedApiVersion || '');
        setAncillaryKey(storedAncillaryKey || '');
        
        // Load API versions from Airtable
        await loadApiVersions();
      } catch (error) {
        console.error('Error loading IDX settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load IDX settings',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  const loadApiVersions = async () => {
    try {
      const base = getBase();
      if (!base) {
        console.log('Airtable connection not available');
        return;
      }
      
      const records = await base('Agent Sites').select({
        fields: ['API Version']
      }).all();
      
      // Extract unique API versions
      const versions = new Set<string>();
      records.forEach(record => {
        const version = record.get('API Version');
        if (version && typeof version === 'string' && version.trim()) {
          versions.add(version);
        }
      });
      
      // Convert to array of objects with id and version
      const versionsList = Array.from(versions).map(version => ({
        id: version.replace(/\./g, '-'),
        version
      }));
      
      setApiVersions(versionsList);
      console.log('Loaded API versions:', versionsList);
      
    } catch (error) {
      console.error('Error fetching API versions from Airtable:', error);
    }
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save settings to config service
      setConfigValue('idx_api_key', apiKey);
      setConfigValue('idx_output_type', outputType);
      setConfigValue('api_version', apiVersion);
      setConfigValue('ancillary_key', ancillaryKey);
      
      toast({
        title: 'Success',
        description: 'IDX settings saved successfully',
      });
    } catch (error) {
      console.error('Error saving IDX settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save IDX settings',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>IDX Broker Integration</CardTitle>
        <CardDescription>
          Configure your IDX Broker API connection to display MLS property listings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="idx-api-key">IDX API Key</Label>
          <Input
            id="idx-api-key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your IDX API key"
            disabled={isLoading}
          />
          <p className="text-sm text-muted-foreground">
            Your API key can be found in your IDX Broker account dashboard
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="idx-output-type">Output Type</Label>
          <Select 
            value={outputType} 
            onValueChange={setOutputType}
            disabled={isLoading}
          >
            <SelectTrigger id="idx-output-type">
              <SelectValue placeholder="Select output type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="xml">XML</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="api-version">API Version</Label>
          <Select 
            value={apiVersion} 
            onValueChange={setApiVersion}
            disabled={isLoading || apiVersions.length === 0}
          >
            <SelectTrigger id="api-version">
              <SelectValue placeholder={apiVersions.length ? "Select API version" : "Connect to Airtable first"} />
            </SelectTrigger>
            <SelectContent>
              {apiVersions.map((version) => (
                <SelectItem key={version.id} value={version.version}>{version.version}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            API versions are loaded from your Airtable 'Agent Sites' table
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ancillary-key">Ancillary Key</Label>
          <Input
            id="ancillary-key"
            value={ancillaryKey}
            onChange={(e) => setAncillaryKey(e.target.value)}
            placeholder="Optional ancillary key"
            disabled={isLoading}
          />
          <p className="text-sm text-muted-foreground">
            Only required for certain IDX Broker features
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSave}
          disabled={isLoading || isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default IDXSettings;
