
/// <reference types="vite/client" />
/// <reference types="@types/node" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

// Properly extend the globalThis type for browser environments
interface GlobalThis {
  document: Document;
  localStorage: Storage;
  location: Location;
  window: Window;
}

// Ensure the file is treated as a module
export {};
