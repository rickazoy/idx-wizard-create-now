
/// <reference types="vite/client" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="es2020" />

// Extend the GlobalThis interface to include browser globals
declare global {
  interface Window extends globalThis {}
}

// Ensure the file is treated as a module
export {};
