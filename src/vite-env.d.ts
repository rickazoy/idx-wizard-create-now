
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
  var window: Window & typeof globalThis;
  var document: Document;
  var localStorage: Storage;
  
  interface Window extends globalThis {}
}

// Ensure the file is treated as a module
export {};
