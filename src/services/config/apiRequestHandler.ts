
import { getConfigValue } from './configStorage';
import { exportConfig, importConfig } from './configStorage';
import { ConfigSettings } from './types';

/**
 * Functions for handling API requests for configuration
 */

// Handle API request with configuration
export const handleConfigApiRequest = async (req: Request): Promise<Response> => {
  const apiKey = req.headers.get('X-API-Key');
  const storedApiKey = getConfigValue('api_key');
  
  // Check if API key is valid
  if (!apiKey || !storedApiKey || apiKey !== storedApiKey) {
    return new Response(JSON.stringify({ error: 'Invalid or missing API key' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Process the request based on method
  if (req.method === 'GET') {
    // Return the current configuration
    return new Response(JSON.stringify(exportConfig()), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if (req.method === 'POST') {
    try {
      // Update configuration with the provided values
      const body = await req.json();
      importConfig(body as Partial<ConfigSettings>);
      
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  // Method not allowed
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
};
