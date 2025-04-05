import { Property } from '@/components/PropertyCard';
import { getConfigValue } from './configService';

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
  rntLse?: string;
  bedrooms: string;
  totalBaths: string;
  latitude: string;
  longitude: string;
  acres: string;
  sqFt: string;
  idxPropType: string;
  idxStatus: string;
  featured: string;
  propStatus?: string;
  image: {
    [key: string]: { url: string; caption: string; } | string;
  };
}

export interface IDXResponse {
  [key: string]: IDXProperty;
}

export const convertIDXToProperty = (idxProperty: IDXProperty): Property => {
  const priceString = idxProperty.listingPrice.replace(/[^0-9]/g, '');
  const price = parseInt(priceString) || 0;
  
  const firstImageKey = Object.keys(idxProperty.image).find(key => key !== 'totalCount');
  const imageData = firstImageKey ? idxProperty.image[firstImageKey] : null;
  const imageUrl = imageData && typeof imageData !== 'string' ? imageData.url : '';

  const bathrooms = parseFloat(idxProperty.totalBaths) || 0;
  
  const bedrooms = parseInt(idxProperty.bedrooms) || 0;
  
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

export const fetchIDXProperties = async (): Promise<Property[]> => {
  try {
    // Get tenant ID for Airtable-based configuration
    const tenantId = localStorage.getItem('tenantId');
    
    // Get all IDX settings using our configService
    const idxApiKey = await getConfigValue('idx_api_key', tenantId);
    const idxApiOutputType = await getConfigValue('idx_output_type', tenantId) || 'json';
    const idxApiVersion = await getConfigValue('idx_api_version', tenantId) || '1.2.2';
    const idxAncillaryKey = await getConfigValue('idx_ancillary_key', tenantId);
    
    if (!idxApiKey) {
      console.log('No IDX API key found in configuration');
      throw new Error('IDX API key not found');
    }
    
    console.log('IDX API Key available:', !!idxApiKey);
    console.log('IDX Output Type:', idxApiOutputType);
    console.log('IDX API Version:', idxApiVersion);
    console.log('IDX Ancillary Key available:', !!idxAncillaryKey);
    
    // Build headers according to IDX Broker documentation
    const headers: HeadersInit = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'accesskey': idxApiKey
    };
    
    // Add optional headers if available
    if (idxApiOutputType) {
      headers['outputtype'] = idxApiOutputType;
    }
    
    if (idxApiVersion) {
      headers['apiversion'] = idxApiVersion;
    }
    
    if (idxAncillaryKey) {
      headers['ancillarykey'] = idxAncillaryKey;
    }
    
    console.log('Sending request to IDX API with headers:', headers);
    
    // For development testing, we'll add a small delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await fetch('/api/idx/properties', {
      headers: headers
    });
    
    if (!response.ok) {
      console.log('Using mock IDX data due to error response:', response.status);
      
      const mockData: { [key: string]: IDXProperty } = {
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
          "idxPropType": "Residential",
          "idxStatus": "active",
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
          "idxPropType": "Residential",
          "idxStatus": "active",
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
      
      return Object.values(mockData).map(convertIDXToProperty);
    }
    
    const data = await response.json();
    console.log('Successfully retrieved IDX properties:', Object.keys(data).length);
    return Object.values(data).map(convertIDXToProperty);
  } catch (error) {
    console.error('Error fetching IDX properties:', error);
    return [];
  }
};
