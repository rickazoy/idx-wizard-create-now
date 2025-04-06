
/// <reference types="vite/client" />
/// <reference types="@types/node" />

// This ensures TypeScript recognizes DOM types
interface Window {
  location: Location;
  localStorage: Storage;
  document: Document;
}

// Ensure these DOM APIs are recognized globally
declare global {
  interface Window extends globalThis {}
}

// Ensure the file is treated as a module
export {};
