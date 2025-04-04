
// This file is kept for backward compatibility
// Import and re-export everything from the new modular structure
export * from './airtable';

// Add console warnings to help developers migrate
const warnAboutDeprecation = () => {
  console.warn(
    'Warning: Importing from airtableService.ts is deprecated. ' +
    'Please import directly from the airtable modules: ' +
    'import { getPrimaryAgent } from "@/services/airtable/agentService"'
  );
};

// Call the warning function
warnAboutDeprecation();
