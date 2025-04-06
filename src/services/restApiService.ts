
import { ConfigSettings } from './config';
import { processConfigUpdate, validateApiKey } from './api';

/**
 * REST API endpoint handler for configuration updates
 */
export const handleApiRequest = async (request: Request): Promise<Response> => {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Method not allowed' 
    }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  try {
    // Check for API key in headers
    const apiKey = request.headers.get('X-API-Key') || '';
    if (!apiKey || !validateApiKey(apiKey)) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Unauthorized: Invalid or missing API key'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Parse request body
    const contentType = request.headers.get('Content-Type') || '';
    if (!contentType.includes('application/json')) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Content-Type must be application/json'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Get the request data
    const data = await request.json() as {
      configData: Partial<ConfigSettings>;
      tenantId?: string;
    };
    
    if (!data.configData || typeof data.configData !== 'object') {
      return new Response(JSON.stringify({
        success: false,
        message: 'Missing or invalid configData in request body'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Process the configuration update - remove the tenantId parameter as it's not expected by the function
    const result = await processConfigUpdate(data.configData, apiKey);
    
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('API request error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: `Error processing request: ${error instanceof Error ? error.message : String(error)}`
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
