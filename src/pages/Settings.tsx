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
import { AlertCircle, Database, Globe, Info, Key, Upload, User, Settings as SettingsIcon } from 'lucide-react';
import ApiEndpoint from '@/components/ApiEndpoint';
import { useConfig } from '@/hooks/useConfigSettings';

const airtableFormSchema = z.object({
  apiKey: z.string().min(1, { message: 'API Token is required' }),
  baseId: z.string().min(1, { message: 'Base ID is required' }),
  listingAgentFilter: z.string().default('all'),
  isAdmin: z.boolean().default(false),
});

const agentFormSchema = z.object({
  name: z.string().min(1, { message: 'Agent name is required' }),
  bio: z.string().min(10, { message: 'Bio should be at least 10 characters' }),
  photoUrl: z.string().default(''),
});

const idxFormSchema = z.object({
  apiKey: z.string().min(1, { message: 'IDX API Key is required' }),
  outputType: z.string().default('json'),
  apiVersion: z.string().default('1.2.2'),
  ancillaryKey: z.string().optional(),
});

type AirtableFormValues = z.infer<typeof airtableFormSchema>;
type AgentFormValues = z.infer<typeof agentFormSchema>;
type IdxFormValues = z.infer<typeof idxFormSchema>;

type SettingsProps = {
  initialTab?: string;
};

const Settings = ({ initialTab }: SettingsProps = {}) => {
  const { toast } = useToast();
  const [listingAgents, setListingAgents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab || "airtable");
  const [photoPreview, setPhotoPreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const tenantId = localStorage.getItem('tenantId');

  useEffect(() => {
    if (initialTab && ["airtable", "idx", "agent", "api"].includes(initialTab)) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const airtableForm = useForm<AirtableFormValues>({
    resolver: zodResolver(airtableFormSchema),
    defaultValues: {
      apiKey: '',
      baseId: '',
      listingAgentFilter: 'all',
      isAdmin: false,
    },
  });

  const agentForm = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: {
      name: '',
      bio: '',
      photoUrl: '',
    },
  });

  const idxForm = useForm<IdxFormValues>({
    resolver: zodResolver(idxFormSchema),
    defaultValues: {
      apiKey: '',
      outputType: 'json',
      apiVersion: '1.2.2',
      ancillaryKey: '',
    },
  });

  const { value: airtableApiKey, updateValue: updateAirtableApiKey } = useConfig({ 
    key: 'airtable_api_key', defaultValue: '' 
  });
  const { value: airtableBaseId, updateValue: updateAirtableBaseId } = useConfig({ 
    key: 'airtable_base_id', defaultValue: '' 
  });
  const { value: airtableAgentFilter, updateValue: updateAirtableAgentFilter } = useConfig({ 
    key: 'airtable_agent_filter', defaultValue: 'all' 
  });
  const { value: isAdmin, updateValue: updateIsAdmin } = useConfig({ 
    key: 'is_admin', defaultValue: 'false' 
  });
  
  const { value: idxApiKey, updateValue: updateIdxApiKey } = useConfig({ 
    key: 'idx_api_key', defaultValue: '' 
  });
  const { value: idxOutputType, updateValue: updateIdxOutputType } = useConfig({ 
    key: 'idx_output_type', defaultValue: 'json' 
  });
  const { value: idxApiVersion, updateValue: updateIdxApiVersion } = useConfig({ 
    key: 'idx_api_version', defaultValue: '1.2.2' 
  });
  const { value: idxAncillaryKey, updateValue: updateIdxAncillaryKey } = useConfig({ 
    key: 'idx_ancillary_key', defaultValue: '' 
  });
  
  const { value: agentName, updateValue: updateAgentName } = useConfig({ 
    key: 'agent_name', defaultValue: 'Adam Johnson' 
  });
  const { value: agentBio, updateValue: updateAgentBio } = useConfig({ 
    key: 'agent_bio', defaultValue: 'A seasoned real estate agent specializing in luxury waterfront condos in Southeast Florida.' 
  });
  const { value: agentPhoto, updateValue: updateAgentPhoto } = useConfig({ 
    key: 'agent_photo', defaultValue: '/lovable-uploads/176200ee-5ba2-4fb0-af34-13fc98eb8fa5.png' 
  });
  
  useEffect(() => {
    airtableForm.reset({
      apiKey: airtableApiKey,
      baseId: airtableBaseId,
      listingAgentFilter: airtableAgentFilter,
      isAdmin: isAdmin === 'true',
    });
  }, [airtableApiKey, airtableBaseId, airtableAgentFilter, isAdmin, airtableForm]);
  
  useEffect(() => {
    idxForm.reset({
      apiKey: idxApiKey,
      outputType: idxOutputType,
      apiVersion: idxApiVersion,
      ancillaryKey: idxAncillaryKey,
    });
  }, [idxApiKey, idxOutputType, idxApiVersion, idxAncillaryKey, idxForm]);
  
  useEffect(() => {
    agentForm.reset({
      name: agentName,
      bio: agentBio,
      photoUrl: agentPhoto,
    });
    setPhotoPreview(agentPhoto);
  }, [agentName, agentBio, agentPhoto, agentForm]);

  useEffect(() => {
    setPhotoPreview(agentForm.watch('photoUrl'));
  }, [agentForm.watch('photoUrl')]);

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
      await updateAirtableApiKey(values.apiKey);
      await updateAirtableBaseId(values.baseId);
      await updateIsAdmin(values.isAdmin.toString());
      
      if (values.listingAgentFilter) {
        await updateAirtableAgentFilter(values.listingAgentFilter);
      }
      
      try {
        await saveAirtableConfig(values.apiKey, values.baseId);
        
        toast({
          title: 'Settings Saved',
          description: 'Your Airtable connection settings have been updated successfully.',
        });
      } catch (error) {
        console.error('Error saving Airtable config:', error);
        toast({
          title: 'Airtable Connection Error',
          description: 'Failed to verify connection to Airtable. Settings are saved locally but connection could not be established.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitAgent = async (values: AgentFormValues) => {
    setIsLoading(true);
    try {
      await updateAgentName(values.name);
      await updateAgentBio(values.bio);
      await updateAgentPhoto(values.photoUrl);
      
      if (airtableForm.getValues('apiKey') && airtableForm.getValues('baseId')) {
        const success = await updateAgent({
          name: values.name,
          bio: values.bio,
          photo: values.photoUrl,
          idx: idxForm.getValues('apiKey')
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

  const onSubmitIdx = async (values: IdxFormValues) => {
    setIsLoading(true);
    try {
      await updateIdxApiKey(values.apiKey);
      await updateIdxOutputType(values.outputType);
      await updateIdxApiVersion(values.apiVersion);
      
      if (values.ancillaryKey) {
        await updateIdxAncillaryKey(values.ancillaryKey);
      }
      
      toast({
        title: 'IDX Settings Saved',
        description: 'Your IDX Broker API settings have been updated successfully.',
      });
      
      if (agentForm.getValues('name')) {
        try {
          await updateAgent({
            name: agentForm.getValues('name'),
            bio: agentForm.getValues('bio'),
            photo: agentForm.getValues('photoUrl'),
            idx: values.apiKey
          });
        } catch (error) {
          console.error('Failed to update agent with IDX key:', error);
        }
      }
    } catch (error) {
      console.error('Error saving IDX settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save IDX settings.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const imageUrl = URL.createObjectURL(file);
    setPhotoPreview(imageUrl);
    
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
            <TabsTrigger value="airtable">
              <Database className="w-4 h-4 mr-2" />
              Airtable
            </TabsTrigger>
            <TabsTrigger value="idx">
              <Globe className="w-4 h-4 mr-2" />
              IDX Broker
            </TabsTrigger>
            <TabsTrigger value="agent">
              <User className="w-4 h-4 mr-2" />
              Agent Profile
            </TabsTrigger>
            <TabsTrigger value="api">
              <SettingsIcon className="w-4 h-4 mr-2" />
              API Integration
            </TabsTrigger>
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
          
          <TabsContent value="idx">
            <Card>
              <CardHeader>
                <CardTitle>IDX Broker API</CardTitle>
                <CardDescription>
                  Configure your IDX Broker API connection for MLS property listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-6 bg-blue-50">
                  <Info className="h-5 w-5 text-blue-500" />
                  <AlertTitle>About IDX Integration</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    <p className="text-sm mb-2">
                      IDX integration allows you to display MLS listings directly on your website. Enter your API credentials below.
                    </p>
                  </AlertDescription>
                </Alert>
                
                <Form {...idxForm}>
                  <form onSubmit={idxForm.handleSubmit(onSubmitIdx)} className="space-y-6">
                    <FormField
                      control={idxForm.control}
                      name="apiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>IDX API Key</FormLabel>
                          <FormControl>
                            <Input placeholder="Your IDX Broker API Key" {...field} />
                          </FormControl>
                          <FormDescription>
                            The 22-character API access key from your IDX Broker dashboard
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={idxForm.control}
                        name="outputType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Output Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select output format" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="json">JSON</SelectItem>
                                <SelectItem value="xml">XML</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              The format for API responses
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={idxForm.control}
                        name="apiVersion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>API Version</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select API version" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1.2.2">v1.2.2 (Latest Stable)</SelectItem>
                                <SelectItem value="1.2.1">v1.2.1</SelectItem>
                                <SelectItem value="1.2.0">v1.2.0</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              The IDX API version to use
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={idxForm.control}
                      name="ancillaryKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ancillary Key (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Your IDX Broker Ancillary Key (if applicable)" {...field} />
                          </FormControl>
                          <FormDescription>
                            For Developer Partners accessing the API on behalf of clients
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="p-4 bg-gray-50 rounded-md border border-gray-200 mb-4">
                      <h3 className="font-medium mb-2">Required Headers</h3>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li><strong>Content-Type:</strong> application/x-www-form-urlencoded (included automatically)</li>
                        <li><strong>accesskey:</strong> Your API key (required)</li>
                        <li><strong>outputtype:</strong> json/xml (optional)</li>
                        <li><strong>apiversion:</strong> Version number (optional)</li>
                        <li><strong>ancillarykey:</strong> Partner key for client access (optional)</li>
                      </ul>
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Saving...' : 'Save IDX Settings'}
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
          
          <TabsContent value="api">
            <ApiEndpoint />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
