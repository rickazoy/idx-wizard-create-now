
// This file is kept for backward compatibility
// Import and re-export everything from the new modular structure
export * from './api';

// Add console warnings to help developers migrate
const warnAboutDeprecation = () => {
  console.log(
    'Info: Importing from apiService.ts is deprecated. ' +
    'Please import directly from the api modules: ' +
    'import { fetchData } from "@/services/api"'
  );
};

// Call the warning function but make it less obtrusive (console.log instead of warn)
warnAboutDeprecation();
