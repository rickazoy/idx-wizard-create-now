
import React, { useState, useEffect, useRef } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchListingAgents, saveAirtableConfig, updateAgent } from '@/services/airtableService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Info, Upload, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';

// Form validation schema for Airtable
const airtableFormSchema = z.object({
  apiKey: z.string().min(1, { message: 'API Token is required' }),
  baseId: z.string().min(1, { message: 'Base ID is required' }),
  listingAgentFilter: z.string().default('all'),
  isAdmin: z.boolean().default(false),
});

// Form validation schema for Agent
const agentFormSchema = z.object({
  name: z.string().min(1, { message: 'Agent name is required' }),
  bio: z.string().min(10, { message: 'Bio should be at least 10 characters' }),
  photoUrl: z.string().default(''),
});

type AirtableFormValues = z.infer<typeof airtableFormSchema>;
type AgentFormValues = z.infer<typeof agentFormSchema>;

const Settings = () => {
  const { toast } = useToast();
  const [listingAgents, setListingAgents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("airtable");
  const [photoPreview, setPhotoPreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Airtable form with default values
  const airtableForm = useForm<AirtableFormValues>({
    resolver: zodResolver(airtableFormSchema),
    defaultValues: {
      apiKey: localStorage.getItem('airtable_api_key') || '',
      baseId: localStorage.getItem('airtable_base_id') || '',
      listingAgentFilter: localStorage.getItem('airtable_agent_filter') || 'all',
      isAdmin: localStorage.getItem('is_admin') === 'true',
    },
  });

  // Initialize Agent form with default values
  const agentForm = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: {
      name: localStorage.getItem('agent_name') || 'Adam Johnson',
      bio: localStorage.getItem('agent_bio') || 'A seasoned real estate agent specializing in luxury waterfront condos in Southeast Florida.',
      photoUrl: localStorage.getItem('agent_photo') || '/lovable-uploads/176200ee-5ba2-4fb0-af34-13fc98eb8fa5.png',
    },
  });

  // Set photo preview when the component loads
  useEffect(() => {
    setPhotoPreview(agentForm.watch('photoUrl'));
  }, [agentForm.watch('photoUrl')]);

  // Fetch listing agents when form values change and user is admin
  useEffect(() => {
    const apiKey = airtableForm.watch('apiKey');
    const baseId = airtableForm.watch('baseId');
    const isAdmin = airtableForm.watch('isAdmin');
    
    const loadListingAgents = async () => {
      if (apiKey && baseId && isAdmin) {
        setIsLoading(true);
        try {
          const agents = await fetchListingAgents(apiKey, baseId);
          setListingAgents(agents);
          console.log('Loaded listing agents:', agents);
        } catch (error) {
          console.error('Error fetching listing agents:', error);
          toast({
            title: 'Error',
            description: 'Failed to fetch listing agents. Please check your API Token and Base ID.',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadListingAgents();
  }, [airtableForm.watch('apiKey'), airtableForm.watch('baseId'), airtableForm.watch('isAdmin'), toast]);

  const onSubmitAirtable = async (values: AirtableFormValues) => {
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
        description: 'Failed to connect to Airtable. Please check your credentials and ensure your table is named "Property Management System Listings".',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitAgent = async (values: AgentFormValues) => {
    setIsLoading(true);
    try {
      // Save agent info to localStorage
      localStorage.setItem('agent_name', values.name);
      localStorage.setItem('agent_bio', values.bio);
      localStorage.setItem('agent_photo', values.photoUrl);
      
      // Also save to Airtable if we have a valid connection
      if (airtableForm.getValues('apiKey') && airtableForm.getValues('baseId')) {
        const success = await updateAgent({
          name: values.name,
          bio: values.bio,
          photo: values.photoUrl
        });
        
        if (success) {
          toast({
            title: 'Agent Settings Saved',
            description: 'Your agent information has been updated successfully in both localStorage and Airtable.',
          });
        } else {
          toast({
            title: 'Partially Saved',
            description: 'Agent information was saved locally but failed to save to Airtable. Please check your Airtable connection.',
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Agent Settings Saved',
          description: 'Your agent information has been updated successfully in localStorage. No Airtable connection configured.',
        });
      }
    } catch (error) {
      console.error('Error saving agent settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save agent information.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Create a URL for the image
    const imageUrl = URL.createObjectURL(file);
    setPhotoPreview(imageUrl);
    
    // Set the file URL in the form
    agentForm.setValue('photoUrl', imageUrl);
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="container-custom py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="airtable">Airtable Connection</TabsTrigger>
            <TabsTrigger value="agent">Agent Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="airtable">
            <Card>
              <CardHeader>
                <CardTitle>Airtable Connection</CardTitle>
                <CardDescription>
                  Configure your Airtable API connection for property listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-6">
                  <Info className="h-5 w-5" />
                  <AlertTitle>Important Setup Information</AlertTitle>
                  <AlertDescription>
                    <p className="text-sm mb-2">
                      This application is configured to work with a table named <strong>"Property Management System Listings"</strong> in your Airtable base.
                    </p>
                    <p className="text-sm">
                      Make sure your Airtable base contains this table name exactly as written, with a <strong>"Listing Agent"</strong> field for filtering.
                    </p>
                  </AlertDescription>
                </Alert>
                
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-amber-800">Important Airtable Setup Information</h3>
                      <p className="text-sm text-amber-700 mt-1">
                        Make sure you have:
                      </p>
                      <ul className="text-sm text-amber-700 list-disc list-inside mt-1 space-y-1">
                        <li>Created a Personal Access Token in your <a href="https://airtable.com/create/tokens" target="_blank" rel="noopener noreferrer" className="underline">Airtable account</a></li>
                        <li>Copied the correct Base ID (it should start with "app")</li>
                        <li>A table named <strong>"Property Management System Listings"</strong> in your base</li>
                        <li>A <strong>"Listing Agent"</strong> field in your table (for filtering properties by agent)</li>
                        <li>Other required fields set up in your table (Property Address, Listing Price, etc.)</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <Form {...airtableForm}>
                  <form onSubmit={airtableForm.handleSubmit(onSubmitAirtable)} className="space-y-6">
                    <FormField
                      control={airtableForm.control}
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
                      control={airtableForm.control}
                      name="apiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Token</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Airtable Personal Access Token" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter your Airtable Personal Access Token
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={airtableForm.control}
                      name="baseId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Base ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Airtable Base ID (starts with 'app')" {...field} />
                          </FormControl>
                          <FormDescription>
                            The ID of your Airtable base containing the "Property Management System Listings" table
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {airtableForm.watch('isAdmin') && (
                      <FormField
                        control={airtableForm.control}
                        name="listingAgentFilter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Filter by Listing Agent</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={listingAgents.length === 0}
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
                            <FormDescription>
                              Filter property listings by a specific agent (uses the "Listing Agent" field)
                              {listingAgents.length === 0 && airtableForm.watch('apiKey') && airtableForm.watch('baseId') && 
                                " - No listing agents found, please ensure your Airtable has a 'Listing Agent' field"}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Saving...' : 'Save Airtable Settings'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="agent">
            <Card>
              <CardHeader>
                <CardTitle>Agent Profile</CardTitle>
                <CardDescription>
                  Configure the featured agent that appears on the homepage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...agentForm}>
                  <form onSubmit={agentForm.handleSubmit(onSubmitAgent)} className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="w-full md:w-2/3 space-y-6">
                        <FormField
                          control={agentForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Agent Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter agent name" {...field} />
                              </FormControl>
                              <FormDescription>
                                The name that will be displayed in the agent section
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={agentForm.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Agent Bio</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Enter agent biography" 
                                  className="min-h-[120px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                A short biography describing the agent's experience and expertise
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={agentForm.control}
                          name="photoUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Agent Photo</FormLabel>
                              <div className="flex flex-col gap-2">
                                <div className="flex gap-2 items-center">
                                  <FormControl>
                                    <Input 
                                      placeholder="URL to agent photo"
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        setPhotoPreview(e.target.value);
                                      }}
                                      className="flex-grow"
                                    />
                                  </FormControl>
                                  <Button 
                                    type="button" 
                                    onClick={handleUploadClick}
                                    variant="outline"
                                    className="flex gap-2 items-center"
                                  >
                                    <Upload className="h-4 w-4" />
                                    Upload
                                  </Button>
                                  <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                  />
                                </div>
                                <FormDescription>
                                  Enter a URL or upload an image file for the agent photo
                                </FormDescription>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="w-full md:w-1/3 flex flex-col items-center justify-start gap-3">
                        <p className="text-sm text-muted-foreground mb-2">Photo Preview</p>
                        <div className="w-full aspect-square bg-gray-100 rounded-md overflow-hidden border">
                          {photoPreview ? (
                            <img 
                              src={photoPreview} 
                              alt="Agent" 
                              className="w-full h-full object-cover"
                              onError={() => setPhotoPreview('')}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <User className="h-20 w-20 text-muted-foreground/40" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Saving...' : 'Save Agent Settings'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
