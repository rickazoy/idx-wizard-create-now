
import { useState, useEffect } from 'react';
import { ConfigSettings, getConfigValue, setConfigValue } from '@/services/configService';

interface UseConfigOptions {
  key: keyof ConfigSettings;
  defaultValue?: string;
}

export function useConfig({ key, defaultValue = '' }: UseConfigOptions) {
  const [value, setValue] = useState<string>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get tenant ID for Airtable configuration
  const tenantId = localStorage.getItem('tenantId');

  // Load the value on mount
  useEffect(() => {
    const loadValue = async () => {
      try {
        const configValue = await getConfigValue(key, tenantId);
        setValue(configValue || defaultValue);
      } catch (error) {
        console.error(`Error loading config value for ${key}:`, error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadValue();
  }, [key, defaultValue, tenantId]);

  // Function to update the value
  const updateValue = async (newValue: string) => {
    setIsLoading(true);
    try {
      await setConfigValue(key, newValue, tenantId);
      setValue(newValue);
      return true;
    } catch (error) {
      console.error(`Error updating config value for ${key}:`, error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { value, setValue, updateValue, isLoading };
}
