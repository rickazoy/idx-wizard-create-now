
/// <reference types="vite/client" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="es2020" />

// Declare global variables for TypeScript
interface Window {
  location: Location;
}

declare var window: Window & typeof globalThis;
declare var document: Document;
declare var localStorage: Storage;
