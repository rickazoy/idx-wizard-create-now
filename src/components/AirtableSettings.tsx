
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { getConfigValue, setConfigValue } from '@/services/config';
import { saveAirtableConfig } from '@/services/airtable/airtableCore';
import { fetchListingAgents } from '@/services/airtable/agentService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AirtableSettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [baseId, setBaseId] = useState('');
  const [agentFilter, setAgentFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [agents, setAgents] = useState<string[]>([]);
  
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        // Load settings from localStorage
        setApiKey(localStorage.getItem('airtable_api_key') || '');
        setBaseId(localStorage.getItem('airtable_base_id') || '');
        setAgentFilter(localStorage.getItem('airtable_agent_filter') || '');
        
        // Also check config service for tenant-specific settings
        const storedApiKey = getConfigValue('airtable_api_key');
        const storedBaseId = getConfigValue('airtable_base_id');
        const storedAgentFilter = getConfigValue('agent_filter');
        
        if (storedApiKey) setApiKey(storedApiKey);
        if (storedBaseId) setBaseId(storedBaseId);
        if (storedAgentFilter) setAgentFilter(storedAgentFilter);
        
        // Load agents list if credentials exist
        if (storedApiKey && storedBaseId) {
          loadAgents(storedApiKey, storedBaseId);
        }
      } catch (error) {
        console.error('Error loading Airtable settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load Airtable settings',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  const loadAgents = async (apiKey: string, baseId: string) => {
    try {
      const agentsList = await fetchListingAgents(apiKey, baseId);
      setAgents(agentsList);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Test connection to Airtable
      await saveAirtableConfig(apiKey, baseId);
      
      // Save agent filter to localStorage
      localStorage.setItem('airtable_agent_filter', agentFilter);
      
      // Also save to config service
      setConfigValue('airtable_api_key', apiKey);
      setConfigValue('airtable_base_id', baseId);
      setConfigValue('agent_filter', agentFilter);
      
      // Load agents after successful connection
      await loadAgents(apiKey, baseId);
      
      toast({
        title: 'Success',
        description: 'Airtable connection established and settings saved',
      });
    } catch (error) {
      console.error('Error saving Airtable settings:', error);
      toast({
        title: 'Error',
        description: `Failed to save Airtable settings: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Airtable Integration</CardTitle>
        <CardDescription>
          Connect to your Airtable base for property and agent data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="airtable-api-key">Airtable API Key</Label>
          <Input
            id="airtable-api-key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Airtable API key"
            disabled={isLoading}
            type="password"
          />
          <p className="text-sm text-muted-foreground">
            You can find your API key in your Airtable account settings
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="base-id">Base ID</Label>
          <Input
            id="base-id"
            value={baseId}
            onChange={(e) => setBaseId(e.target.value)}
            placeholder="e.g., appXXXXXXXXXXXXXX"
            disabled={isLoading}
          />
          <p className="text-sm text-muted-foreground">
            Found in your Airtable base URL or API documentation
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="agent-filter">Agent Filter</Label>
          <Select 
            value={agentFilter} 
            onValueChange={setAgentFilter}
            disabled={isLoading || agents.length === 0}
          >
            <SelectTrigger id="agent-filter" className="w-full">
              <SelectValue placeholder={agents.length ? "Select an agent" : "Connect to Airtable first"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Agents</SelectItem>
              {agents.map((agent) => (
                <SelectItem key={agent} value={agent}>{agent}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Filter properties by agent (requires connection to Airtable)
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSave}
          disabled={isLoading || isSaving || !apiKey || !baseId}
        >
          {isSaving ? 'Saving...' : 'Test Connection & Save'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AirtableSettings;
