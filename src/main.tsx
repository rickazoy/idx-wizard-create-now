
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Clear any browser caches related to localStorage
const debugCache = () => {
  // Log all agent-related localStorage items to verify they exist
  console.log("AGENT DATA IN LOCALSTORAGE:", {
    name: localStorage.getItem('agent_name'),
    bio: localStorage.getItem('agent_bio'),
    photo: localStorage.getItem('agent_photo')
  });
};

// Force a complete application re-render with a unique key
const renderApp = () => {
  const rootElement = document.getElementById("root");
  
  // Clear any existing content
  if (rootElement) {
    rootElement.innerHTML = '';
    
    // Debug localStorage before rendering
    debugCache();
    
    // Create a new root and render with a unique timestamp key
    const root = createRoot(rootElement);
    root.render(<App key={`app-instance-${Date.now()}`} />);
    
    console.log("Application rendered with fresh instance at:", new Date().toISOString());
  }
};

// Render the application
renderApp();
