
/// <reference types="vite/client" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="es2020" />

// Declaration merging to augment existing Window interface
interface Window {
  location: Location;
}

// Make sure TypeScript knows about the global objects
declare var window: Window & typeof globalThis;
declare var document: Document;
declare var localStorage: Storage;

// These exports ensure the definitions are treated as a module
export {};
