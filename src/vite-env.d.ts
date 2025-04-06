
/// <reference types="vite/client" />
/// <reference types="@types/node" />

// Explicitly declare DOM types to resolve TypeScript errors
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
