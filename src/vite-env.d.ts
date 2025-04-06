
/// <reference types="vite/client" />
/// <reference types="@types/node" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

// Augment the globalThis interface with browser-specific properties
interface Window {
  document: Document;
  localStorage: Storage;
  location: Location;
}

// Add Window properties to globalThis for TypeScript
declare global {
  var document: Document;
  var localStorage: Storage;
  var location: Location;
}

// Ensure the file is treated as a module
export {};
