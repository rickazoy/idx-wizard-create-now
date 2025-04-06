
/// <reference types="vite/client" />
/// <reference types="@types/node" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

// Declare globalThis augmentations for TypeScript
declare interface GlobalThis {
  document: Document;
  window: Window & typeof globalThis;
  location: Location;
  localStorage: Storage;
}

// Ensure the file is treated as a module
export {};
