import { OpenStreetMapService } from '../OpenStreetMapService';

// Mock fetch for testing
global.fetch = jest.fn();

describe('OpenStreetMapService', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('searchPlaces', () => {
    it('should search for places and return formatted results', async () => {
      const mockResponse = {
        features: [
          {
            properties: {
              name: 'Berlin',
              city: 'Berlin',
              country: 'Germany',
              countrycode: 'de',
              osm_id: 12345
            },
            geometry: {
              coordinates: [13.4050, 52.5200]
            }
          }
        ]
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const results = await OpenStreetMapService.searchPlaces('Berlin', 5);

      expect(results).toHaveLength(1);
      expect(results[0]).toEqual({
        place_id: '12345',
        formatted_address: 'Berlin',
        lat: 52.5200,
        lng: 13.4050,
        city: 'Berlin',
        country: 'Germany',
        country_code: 'DE',
        address_components: expect.any(Array)
      });

      expect(fetch).toHaveBeenCalledWith(
        'https://photon.komoot.io/api?q=Berlin&limit=5&lang=en'
      );
    });

    it('should handle empty results', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ features: [] })
      });

      const results = await OpenStreetMapService.searchPlaces('nonexistent', 5);

      expect(results).toHaveLength(0);
    });

    it('should handle API errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      const results = await OpenStreetMapService.searchPlaces('Berlin', 5);

      expect(results).toHaveLength(0);
    });
  });

  describe('reverseGeocode', () => {
    it('should reverse geocode coordinates', async () => {
      const mockResponse = {
        display_name: 'Berlin, Germany',
        lat: '52.5200',
        lon: '13.4050',
        address: {
          city: 'Berlin',
          country: 'Germany',
          country_code: 'de'
        }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await OpenStreetMapService.reverseGeocode(52.5200, 13.4050);

      expect(result).toEqual({
        place_id: expect.any(String),
        formatted_address: 'Berlin, Germany',
        lat: 52.5200,
        lng: 13.4050,
        city: 'Berlin',
        country: 'Germany',
        country_code: 'DE',
        address_components: expect.any(Array)
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/https:\/\/nominatim\.openstreetmap\.org\/reverse\?lat=52\.52&lon=13\.405&format=json&addressdetails=1/)
      );
    });
  });

  describe('getDataFromAddressComponents', () => {
    it('should extract city, country, and country_code from address components', () => {
      const addressComponents = [
        { long_name: 'Berlin', short_name: 'Berlin', types: ['locality'] },
        { long_name: 'Germany', short_name: 'DE', types: ['country'] }
      ];

      const result = OpenStreetMapService.getDataFromAddressComponents(addressComponents);

      expect(result).toEqual({
        city: 'Berlin',
        country: 'Germany',
        country_code: 'DE'
      });
    });

    it('should handle missing components', () => {
      const addressComponents: any[] = [];

      const result = OpenStreetMapService.getDataFromAddressComponents(addressComponents);

      expect(result).toEqual({
        city: '',
        country: '',
        country_code: ''
      });
    });
  });
});
