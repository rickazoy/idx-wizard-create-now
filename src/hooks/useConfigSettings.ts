
import { useState, useEffect } from 'react';
import { getConfigValue, setConfigValue } from '@/services/configService';

// Update the ConfigKey type to match exactly what's in configService.ts
export type ConfigKey = 
  | 'idx_api_key' 
  | 'idx_api_version' 
  | 'idx_ancillary_key'
  | 'idx_output_type'
  | 'api_version'
  | 'ancillary_key'
  | 'airtable_api_key' 
  | 'airtable_base_id' 
  | 'airtable_agent_filter'
  | 'agent_filter'
  | 'api_key'
  | 'agent_name'
  | 'agent_bio'
  | 'agent_photo'
  | 'agent_phone'
  | 'agent_email'
  | 'agent_license';

export function useConfigSetting(key: ConfigKey) {
  const [value, setValue] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get the initial value from localStorage
    const storedValue = getConfigValue(key);
    setValue(storedValue);
    setIsLoading(false);
  }, [key]);

  const updateValue = (newValue: string | null) => {
    if (newValue === null) {
      localStorage.removeItem(key);
      setValue(null);
    } else {
      setConfigValue(key, newValue);
      setValue(newValue);
    }
  };

  return { value, updateValue, isLoading };
}
