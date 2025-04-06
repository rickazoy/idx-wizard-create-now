
import { toast } from 'sonner';

// Re-export everything from the separate modules
export * from './types';
export * from './browserUtils';
export * from './configStorage';
export * from './urlConfig';
export * from './configStatus';
export * from './apiKeyGenerator';
export * from './apiRequestHandler';

// Add a notification function for imports
export const importConfig = (config: Partial<import('./types').ConfigSettings>): void => {
  try {
    // Use the actual importConfig from configStorage
    const { importConfig: importConfigImpl } = require('./configStorage');
    importConfigImpl(config);
    
    toast.success('Configuration imported successfully');
  } catch (error) {
    console.error('Error importing configuration:', error);
    toast.error('Failed to import configuration');
  }
};
