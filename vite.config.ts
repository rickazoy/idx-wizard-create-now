
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // Using react-swc plugin that's likely already installed
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
          });
          proxy.on('proxyRes', (_proxyRes, req, _res) => {
            console.log('Received Response:', req.method, req.url);
          });
        },
        // Mock the response - fixed return type
        bypass: (req, res, _options) => { // Added the options parameter
          const idxApiKey = req.headers.authorization?.split(' ')[1];
          
          if (req.url === '/api/idx/properties' && idxApiKey) {
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
            
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(mockData));
            return true; // This now correctly returns a boolean
          }
          
          return false; // This now correctly returns a boolean
        }
      }
    }
  }
})
