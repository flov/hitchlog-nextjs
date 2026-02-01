interface OSMPlace {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    country?: string;
    country_code?: string;
    state?: string;
    county?: string;
  };
  type?: string;
  class?: string;
}

interface OSMGeocodeResult {
  place_id: string;
  formatted_address: string;
  lat: number;
  lng: number;
  city: string;
  country: string;
  country_code: string;
  address_components: {
    long_name: string;
    short_name: string;
    types: string[];
  }[];
}

export class OpenStreetMapService {
  private static readonly NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
  private static readonly PHOTON_BASE_URL = 'https://photon.komoot.io/api';
  
  // Rate limiting: 1 request per second for Nominatim
  private static lastRequestTime = 0;
  private static readonly MIN_REQUEST_INTERVAL = 1000; // 1 second

  private static async rateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
      const delay = this.MIN_REQUEST_INTERVAL - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    this.lastRequestTime = Date.now();
  }

  static async searchPlaces(query: string, limit: number = 5): Promise<OSMGeocodeResult[]> {
    await this.rateLimit();
    
    try {
      // Use Photon for better rate limits and autocomplete
      const response = await fetch(
        `${this.PHOTON_BASE_URL}?q=${encodeURIComponent(query)}&limit=${limit}&lang=en`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return this.transformPhotonResults(data.features || []);
    } catch (error) {
      console.error('Error searching places:', error);
      return [];
    }
  }

  static async geocodePlace(placeId: string): Promise<OSMGeocodeResult | null> {
    await this.rateLimit();
    
    try {
      const response = await fetch(
        `${this.NOMINATIM_BASE_URL}/details?place_id=${placeId}&format=json&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return this.transformNominatimResult(data);
    } catch (error) {
      console.error('Error geocoding place:', error);
      return null;
    }
  }

  static async reverseGeocode(lat: number, lng: number): Promise<OSMGeocodeResult | null> {
    await this.rateLimit();
    
    try {
      const response = await fetch(
        `${this.NOMINATIM_BASE_URL}/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return this.transformNominatimResult(data);
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }

  private static transformPhotonResults(features: any[]): OSMGeocodeResult[] {
    return features.map(feature => {
      const properties = feature.properties;
      const geometry = feature.geometry;
      
      return {
        place_id: properties.osm_id?.toString() || Math.random().toString(),
        formatted_address: properties.name || properties.display_name || '',
        lat: geometry.coordinates[1],
        lng: geometry.coordinates[0],
        city: properties.city || properties.town || properties.village || '',
        country: properties.country || '',
        country_code: properties.countrycode?.toUpperCase() || '',
        address_components: this.extractAddressComponents(properties)
      };
    });
  }

  private static transformNominatimResult(data: any): OSMGeocodeResult | null {
    if (!data) return null;
    
    const address = data.address || {};
    
    return {
      place_id: data.place_id?.toString() || Math.random().toString(),
      formatted_address: data.display_name || '',
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lon),
      city: address.city || address.town || address.village || '',
      country: address.country || '',
      country_code: address.country_code?.toUpperCase() || '',
      address_components: this.extractAddressComponents(address)
    };
  }

  private static extractAddressComponents(address: any): any[] {
    const components = [];
    
    if (address.city) components.push({ long_name: address.city, short_name: address.city, types: ['locality'] });
    if (address.town) components.push({ long_name: address.town, short_name: address.town, types: ['locality'] });
    if (address.village) components.push({ long_name: address.village, short_name: address.village, types: ['locality'] });
    if (address.country) components.push({ long_name: address.country, short_name: address.country_code, types: ['country'] });
    if (address.state) components.push({ long_name: address.state, short_name: address.state, types: ['administrative_area_level_1'] });
    
    return components;
  }

  static getDataFromAddressComponents(addressComponents: any[]): {
    city: string;
    country: string;
    country_code: string;
  } {
    const city = addressComponents.find(component => 
      component.types.includes('locality')
    )?.long_name || '';
    
    const country = addressComponents.find(component => 
      component.types.includes('country')
    )?.long_name || '';
    
    const country_code = addressComponents.find(component => 
      component.types.includes('country')
    )?.short_name || '';
    
    return { city, country, country_code };
  }
}

