
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // Using react-swc plugin that's likely already installed
import path from 'path'
import { componentTagger } from "lovable-tagger"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8080, // Setting port to 8080 as required
    proxy: {
      // Mock API for IDX integration
      '/api/idx/properties': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request:', req.method, req.url);
            
            // Log headers being sent to IDX API
            const headers = proxyReq.getHeaders();
            console.log('Request Headers:', headers);
          });
          proxy.on('proxyRes', (_proxyRes, req, _res) => {
            console.log('Received Response:', req.method, req.url);
          });
        },
        // Mock the response - fixed return type
        bypass: (req, res, _options) => { 
          const idxApiKey = req.headers.accesskey || req.headers.authorization?.split(' ')[1];
          
          if (req.url && req.url === '/api/idx/properties' && idxApiKey) {
            // Send mock IDX data
            const mockData = {
              "a000!%5362657": {
                "address": "20 Ingram Street",
                "streetName": "Ingram Street",
                "streetNumber": "20",
                "streetDirection": "N",
                "unitNumber": "",
                "cityName": "Forest Hills",
                "countyName": "New York",
                "state": "NY",
                "zipcode": "11375",
                "listingPrice": "$1,151,000",
                "listingID": "idx-5362657",
                "remarksConcat": "From nytimes.com: In the comics, Peter Parker, the mild-mannered photojournalist who is Spider-Man's alter ego, grew up at 20 Ingram Street...",
                "rntLse": "neither",
                "propStatus": "Active",
                "bedrooms": "3",
                "totalBaths": "2.75",
                "latitude": "40.712968",
                "longitude": "-73.843206",
                "acres": "0.24",
                "sqFt": "2,760",
                "displayAddress": "y",
                "listingAgentID": "8675301",
                "listingOfficeID": "lmnop",
                "sample_mlsPtID": "1",
                "sample_mlsPhotoCount": "39",
                "parentPtID": "1",
                "detailsURL": "a000/5362657",
                "idxID": "a000",
                "idxPropType": "Residential",
                "idxStatus": "active",
                "viewCount": "2",
                "mediaData": [],
                "ohCount": "0",
                "vtCount": "0",
                "featured": "y",
                "image": {
                  "0": {
                    "url": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000&auto=format&fit=crop",
                    "caption": "Front view"
                  },
                  "totalCount": "39"
                }
              },
              "a000!%5358959": {
                "address": "177A Bleecker Street",
                "streetName": "Bleecker Street",
                "streetNumber": "177",
                "streetDirection": "N",
                "unitNumber": "A",
                "cityName": "Greenwich Village",
                "countyName": "New York",
                "state": "NY",
                "zipcode": "10012",
                "listingPrice": "$616,000,000",
                "listingID": "idx-5358959",
                "remarksConcat": "Home to Dr. Stephen Vincent Strange(Doctor Strange in Marvel comics) and his faithful bodyguard and manservant Wong...",
                "rntLse": "neither",
                "propStatus": "Active",
                "bedrooms": "2",
                "totalBaths": "2.75",
                "latitude": "40.729117",
                "longitude": "-74.000773",
                "acres": "0.31",
                "sqFt": "20,680",
                "displayAddress": "y",
                "listingAgentID": "8675301",
                "listingOfficeID": "lmnop",
                "sample_mlsPtID": "1",
                "sample_mlsPhotoCount": "34",
                "parentPtID": "1",
                "detailsURL": "a000/5358959",
                "idxID": "a000",
                "idxPropType": "Residential",
                "idxStatus": "active",
                "viewCount": "6",
                "mediaData": [],
                "ohCount": "0",
                "vtCount": "0",
                "featured": "y",
                "image": {
                  "0": {
                    "url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop",
                    "caption": "Front"
                  },
                  "totalCount": "34"
                }
              }
            };
            
            // Log received headers for debugging
            console.log('Received headers:', req.headers);
            
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(mockData));
            return true as any; // Using type assertion to fix the error
          }
          
          return false as any; // Using type assertion to fix the error
        }
      },
      // New custom API endpoint for configuration
      '/api/config': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
        },
        bypass: (req, res) => {
          if (req.url && req.url.startsWith('/api/config')) {
            // Import is dynamic to avoid issues with SSR/ESM
            import('./src/services/restApiService').then(module => {
              const { handleApiRequest } = module;
              
              // Create a Request object from the req
              const request = new Request(`http://localhost:8080${req.url}`, {
                method: req.method,
                headers: req.headers as any,
                body: req.method !== 'GET' && req.method !== 'HEAD' ? req : undefined,
              });
              
              // Handle the request with our API handler
              handleApiRequest(request).then(response => {
                // Set status code
                res.statusCode = response.status;
                
                // Set headers
                response.headers.forEach((value, key) => {
                  res.setHeader(key, value);
                });
                
                // Send body
                response.text().then(body => {
                  res.end(body);
                });
              });
              
              return true as any; // Using type assertion to fix the error
            });
          }
          return false as any; // Using type assertion to fix the error
        }
      }
    }
  }
}))
