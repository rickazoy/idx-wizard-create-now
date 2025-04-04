
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetchListingAgents, saveAirtableConfig } from '@/services/airtableService';

// Form validation schema
const formSchema = z.object({
  apiKey: z.string().min(1, { message: 'API Key is required' }),
  baseId: z.string().min(1, { message: 'Base ID is required' }),
  listingAgentFilter: z.string().optional(),
  isAdmin: z.boolean().default(false),
});

type SettingsFormValues = z.infer<typeof formSchema>;

const Settings = () => {
  const { toast } = useToast();
  const [listingAgents, setListingAgents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with default values
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: localStorage.getItem('airtable_api_key') || '',
      baseId: localStorage.getItem('airtable_base_id') || '',
      listingAgentFilter: localStorage.getItem('airtable_agent_filter') || '',
      isAdmin: localStorage.getItem('is_admin') === 'true',
    },
  });

  // Fetch listing agents when form values change and user is admin
  useEffect(() => {
    const apiKey = form.watch('apiKey');
    const baseId = form.watch('baseId');
    const isAdmin = form.watch('isAdmin');
    
    const loadListingAgents = async () => {
      if (apiKey && baseId && isAdmin) {
        setIsLoading(true);
        try {
          const agents = await fetchListingAgents(apiKey, baseId);
          setListingAgents(agents);
        } catch (error) {
          console.error('Error fetching listing agents:', error);
          toast({
            title: 'Error',
            description: 'Failed to fetch listing agents. Please check your API key and Base ID.',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadListingAgents();
  }, [form.watch('apiKey'), form.watch('baseId'), form.watch('isAdmin')]);

  const onSubmit = async (values: SettingsFormValues) => {
    setIsLoading(true);
    try {
      // Save config to localStorage
      localStorage.setItem('airtable_api_key', values.apiKey);
      localStorage.setItem('airtable_base_id', values.baseId);
      localStorage.setItem('is_admin', values.isAdmin.toString());
      
      if (values.listingAgentFilter) {
        localStorage.setItem('airtable_agent_filter', values.listingAgentFilter);
      } else {
        localStorage.removeItem('airtable_agent_filter');
      }
      
      // Try to connect to Airtable with the new config
      await saveAirtableConfig(values.apiKey, values.baseId);
      
      toast({
        title: 'Settings Saved',
        description: 'Your Airtable connection settings have been updated successfully.',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to connect to Airtable. Please check your credentials.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-custom py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Airtable Connection</CardTitle>
            <CardDescription>
              Configure your Airtable API connection for property listings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="isAdmin"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Admin Mode</FormLabel>
                        <FormDescription>
                          Enable admin features for Airtable configuration
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Airtable API key" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="baseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Airtable Base ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {form.watch('isAdmin') && (
                  <FormField
                    control={form.control}
                    name="listingAgentFilter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Filter by Listing Agent</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a listing agent (optional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">All Agents</SelectItem>
                            {listingAgents.map((agent) => (
                              <SelectItem key={agent} value={agent}>
                                {agent}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Settings'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
