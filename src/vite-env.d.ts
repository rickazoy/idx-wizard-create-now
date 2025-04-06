
/// <reference types="vite/client" />
/// <reference types="@types/node" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

// Explicitly inform TypeScript about DOM globals
interface Window {
  location: Location;
  localStorage: Storage;
  document: Document;
}

declare global {
  interface Window {
    location: Location;
    localStorage: Storage;
    document: Document;
  }
  
  const window: Window & typeof globalThis;
  const document: Document;
  const localStorage: Storage;
}

// Ensure the file is treated as a module
export {};
