
import { Property } from '@/components/PropertyCard';

export interface IDXProperty {
  address: string;
  streetName: string;
  streetNumber: string;
  streetDirection?: string;
  unitNumber?: string;
  cityName: string;
  countyName: string;
  state: string;
  zipcode: string;
  listingPrice: string;
  listingID: string;
  remarksConcat: string;
  bedrooms: string;
  totalBaths: string;
  latitude: string;
  longitude: string;
  acres: string;
  sqFt: string;
  idxPropType: string;
  idxStatus: string;
  featured: string;
  image: {
    [key: string]: { url: string; caption: string; } | string;
  };
}

export interface IDXResponse {
  [key: string]: IDXProperty;
}

// Convert IDX property to our app's Property format
export const convertIDXToProperty = (idxProperty: IDXProperty): Property => {
  // Extract numeric value from price string
  const priceString = idxProperty.listingPrice.replace(/[^0-9]/g, '');
  const price = parseInt(priceString) || 0;
  
  // Get primary image URL
  const firstImageKey = Object.keys(idxProperty.image).find(key => key !== 'totalCount');
  const imageData = firstImageKey ? idxProperty.image[firstImageKey] : null;
  const imageUrl = imageData && typeof imageData !== 'string' ? imageData.url : '';

  // Convert bathroom string to number (handle decimal values)
  const bathrooms = parseFloat(idxProperty.totalBaths) || 0;
  
  // Convert bedroom string to number
  const bedrooms = parseInt(idxProperty.bedrooms) || 0;
  
  // Convert square feet string to number (remove commas and other characters)
  const sqFtString = idxProperty.sqFt.replace(/[^0-9]/g, '');
  const squareFeet = parseInt(sqFtString) || 0;
  
  return {
    id: idxProperty.listingID,
    address: idxProperty.address,
    city: idxProperty.cityName,
    state: idxProperty.state,
    zipCode: idxProperty.zipcode,
    price: price,
    bedrooms: bedrooms,
    bathrooms: bathrooms,
    squareFeet: squareFeet,
    propertyType: idxProperty.idxPropType,
    listingType: idxProperty.idxStatus === 'active' ? 'For Sale' : 'For Rent',
    imageUrl: imageUrl || 'https://placehold.co/600x400?text=No+Image',
    description: idxProperty.remarksConcat,
    isIdxProperty: true
  };
};

// Fetch IDX properties
export const fetchIDXProperties = async (): Promise<Property[]> => {
  try {
    const apiKey = localStorage.getItem('idx_api_key');
    if (!apiKey) {
      throw new Error('IDX API key not found');
    }

    // This would be a real API call in production
    // For now we're mocking the response for demonstration
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Sample IDX data (in real world, you'd fetch from the API)
    const response = await fetch('/api/idx/properties', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    if (!response.ok) {
      // For demo purposes, return mock data if API call fails
      console.log('Using mock IDX data');
      
      // Create a sample IDX response
      const mockData: IDXResponse = {
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
            "totalCount": "39" as any
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
            "totalCount": "34" as any
          }
        }
      };
      
      // Convert each IDX property to our app's Property format
      return Object.values(mockData).map(convertIDXToProperty);
    }
    
    const data = await response.json();
    return Object.values(data).map(convertIDXToProperty);
  } catch (error) {
    console.error('Error fetching IDX properties:', error);
    return [];
  }
};
