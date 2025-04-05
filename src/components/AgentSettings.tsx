
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { getConfigValue, setConfigValue } from '@/services/configService';

const AgentSettings = () => {
  const [agentName, setAgentName] = useState('');
  const [agentBio, setAgentBio] = useState('');
  const [agentPhoto, setAgentPhoto] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const tenantId = localStorage.getItem('tenantId');
        
        // Load settings from config service
        const storedAgentName = await getConfigValue('agent_name', tenantId);
        const storedAgentBio = await getConfigValue('agent_bio', tenantId);
        const storedAgentPhoto = await getConfigValue('agent_photo', tenantId);
        
        setAgentName(storedAgentName);
        setAgentBio(storedAgentBio);
        setAgentPhoto(storedAgentPhoto);
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
      const tenantId = localStorage.getItem('tenantId');
      
      // Save settings to config service
      await setConfigValue('agent_name', agentName, tenantId);
      await setConfigValue('agent_bio', agentBio, tenantId);
      await setConfigValue('agent_photo', agentPhoto, tenantId);
      
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
            Enter a direct link to the agent's profile photo
          </p>
        </div>
        
        {agentPhoto && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Photo Preview:</p>
            <div className="w-32 h-32 rounded-full overflow-hidden bg-muted">
              <img 
                src={agentPhoto} 
                alt={agentName || "Agent"} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Agent";
                }}
              />
            </div>
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
