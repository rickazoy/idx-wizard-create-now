
// This file is kept for backward compatibility
// Import and re-export everything from the new modular structure
export * from './config';

// Add console warnings to help developers migrate
const warnAboutDeprecation = () => {
  console.log(
    'Info: Importing from configService.ts is deprecated. ' +
    'Please import directly from the config modules: ' +
    'import { getConfigValue } from "@/services/config"'
  );
};

// Call the warning function but make it less obtrusive (console.log instead of warn)
warnAboutDeprecation();
