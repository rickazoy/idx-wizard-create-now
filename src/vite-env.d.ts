
/// <reference types="vite/client" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="es2020" />

interface Window {
  location: Location;
}

// Declare global variables that should be available in browser contexts
declare global {
  interface Window {
    location: Location;
  }
  var window: Window & typeof globalThis;
  var document: Document;
  var localStorage: Storage;
}

// These exports ensure the definitions are treated as a module
export {};
