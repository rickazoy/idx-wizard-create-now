
/// <reference types="vite/client" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="es2020" />

// These interfaces and declarations help TypeScript understand browser globals
declare interface Window {
  location: Location;
}

declare var window: Window & typeof globalThis;
declare var document: Document;
declare var localStorage: Storage;

// These exports ensure the definitions are treated as a module
export {};
