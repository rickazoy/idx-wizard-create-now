
/// <reference types="vite/client" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="es2020" />

// Add type declarations to make TypeScript happy when using globalThis
interface GlobalThis {
  window: Window & typeof globalThis;
  document: Document;
  localStorage: Storage;
}

// Ensure the file is treated as a module
export {};
