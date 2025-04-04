
// This file is kept for backward compatibility
// Import and re-export everything from the new modular structure
export * from './airtable/index';

// Add console warnings to help developers migrate
const warnAboutDeprecation = () => {
  console.log(
    'Info: Importing from airtable.ts is deprecated. ' +
    'Please import directly from the airtable modules: ' +
    'import { getPrimaryAgent } from "@/services/airtable/agentService"'
  );
};

// Call the warning function but make it less obtrusive (console.log instead of warn)
warnAboutDeprecation();
