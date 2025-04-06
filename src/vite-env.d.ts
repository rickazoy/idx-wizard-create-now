/// <reference types="vite/client" />
/// <reference types="@types/node" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

// No need to redefine the Window interface as it's already defined in lib="dom"

declare global {
  // These declarations are unnecessary when using /// <reference lib="dom" />
  // but keeping them for backward compatibility
  interface Window {
    location: Location;
    localStorage: Storage;
    document: Document;
  }
}

// Ensure the file is treated as a module
export {};
