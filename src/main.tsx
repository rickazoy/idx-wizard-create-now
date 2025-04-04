
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Force a complete application re-render with a unique key
const renderApp = () => {
  const rootElement = document.getElementById("root");
  
  // Clear any existing content
  if (rootElement) {
    rootElement.innerHTML = '';
    
    // Create a new root and render with a unique timestamp key
    const root = createRoot(rootElement);
    root.render(<App key={`app-instance-${Date.now()}`} />);
    
    console.log("Application rendered with fresh instance at:", new Date().toISOString());
  }
};

// Render the application
renderApp();
