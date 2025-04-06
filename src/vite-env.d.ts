
/// <reference types="vite/client" />
/// <reference types="@types/node" />

// Explicitly inform TypeScript about DOM globals
interface Window {
  location: Location;
  localStorage: Storage;
  document: Document;
}

declare global {
  const window: Window;
  const document: Document;
  const localStorage: Storage;
}

// Ensure the file is treated as a module
export {};
