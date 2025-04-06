
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { getConfigValue, setConfigValue } from '@/services/config';
import { getPrimaryAgent, updateAgent } from '@/services/airtable/agentService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AgentSettings = () => {
  const [agentName, setAgentName] = useState('');
  const [agentBio, setAgentBio] = useState('');
  const [agentPhoto, setAgentPhoto] = useState('');
  const [agentLogo, setAgentLogo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tenantId, setTenantId] = useState('');
  
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        // First check Airtable for agent data
        const agent = await getPrimaryAgent();
        
        if (agent) {
          setAgentName(agent.name || '');
          setAgentBio(agent.bio || '');
          setAgentPhoto(agent.photo || '');
          setAgentLogo(agent.logo || '');
          
          // Also set config values from Airtable for backward compatibility
          setConfigValue('agent_name', agent.name || '');
          setConfigValue('agent_bio', agent.bio || '');
          setConfigValue('agent_photo', agent.photo || '');
        } else {
          // Fallback to local config
          const storedAgentName = getConfigValue('agent_name');
          const storedAgentBio = getConfigValue('agent_bio');
          const storedAgentPhoto = getConfigValue('agent_photo');
          
          setAgentName(storedAgentName || '');
          setAgentBio(storedAgentBio || '');
          setAgentPhoto(storedAgentPhoto || '');
        }
        
        // Get tenant ID from URL (if available)
        const urlParams = new URLSearchParams(window.location.search);
        const tenant = urlParams.get('tenant');
        if (tenant) {
          setTenantId(tenant);
        }
        
      } catch (error) {
        console.error('Error loading agent settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load agent settings',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save to Airtable
      const success = await updateAgent({
        name: agentName,
        bio: agentBio,
        photo: agentPhoto,
        logo: agentLogo,
      });
      
      if (!success) {
        throw new Error('Failed to update agent in Airtable');
      }
      
      // Also save to local config for backward compatibility
      setConfigValue('agent_name', agentName);
      setConfigValue('agent_bio', agentBio);
      setConfigValue('agent_photo', agentPhoto);
      
      toast({
        title: 'Success',
        description: 'Agent settings saved successfully',
      });
    } catch (error) {
      console.error('Error saving agent settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save agent settings',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Information</CardTitle>
        <CardDescription>
          Configure your agent profile information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="agent-name">Agent Name</Label>
          <Input
            id="agent-name"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            placeholder="Enter agent name"
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="agent-bio">Agent Bio</Label>
          <Textarea
            id="agent-bio"
            value={agentBio}
            onChange={(e) => setAgentBio(e.target.value)}
            placeholder="Enter agent biography"
            disabled={isLoading}
            rows={4}
          />
        </div>
        
        <div className="flex space-x-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agent-photo">Agent Photo URL</Label>
              <Input
                id="agent-photo"
                value={agentPhoto}
                onChange={(e) => setAgentPhoto(e.target.value)}
                placeholder="Enter URL to agent photo"
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground">
                Photos are automatically pulled from 'Agent Photo' in the Airtable 'Agents' table
              </p>
            </div>
            
            {agentPhoto && (
              <div>
                <p className="text-sm font-medium mb-2">Photo Preview:</p>
                <Avatar className="h-20 w-20">
                  <AvatarImage src={agentPhoto} alt={agentName || "Agent"} />
                  <AvatarFallback>{agentName?.charAt(0) || 'A'}</AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agent-logo">Agent Logo URL</Label>
              <Input
                id="agent-logo"
                value={agentLogo}
                onChange={(e) => setAgentLogo(e.target.value)}
                placeholder="Enter URL to agent logo"
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground">
                Logos are automatically pulled from 'Agent Logo' in the Airtable 'Agents' table
              </p>
            </div>
            
            {agentLogo && (
              <div>
                <p className="text-sm font-medium mb-2">Logo Preview:</p>
                <div className="w-32 h-16 bg-white rounded border flex items-center justify-center p-2">
                  <img 
                    src={agentLogo} 
                    alt={`${agentName || "Agent"} Logo`} 
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Logo";
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {tenantId && (
          <div className="mt-4 p-3 bg-slate-100 rounded">
            <p className="text-sm font-medium">Tenant ID</p>
            <p className="text-xs text-muted-foreground">{tenantId}</p>
            <p className="text-xs mt-1">The tenant ID is available from the URL when using multi-tenant mode.</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSave}
          disabled={isLoading || isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Agent Information'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AgentSettings;
