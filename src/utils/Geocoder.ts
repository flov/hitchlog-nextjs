import { OpenStreetMapService } from './OpenStreetMapService';

export type GeocodeResult = {
  place_id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  country: string;
  country_code: string;
  formatted_address: string;
};

export const geocode = (
  geocoderRequest: { location?: { lat: () => number; lng: () => number }; address?: string; placeId?: string }
): Promise<GeocodeResult> => {
  if (geocoderRequest.location) {
    return OpenStreetMapService.reverseGeocode(
      geocoderRequest.location.lat(),
      geocoderRequest.location.lng()
    ).then((result) => {
      if (!result) return Promise.reject({});
      const { city, country, country_code } =
        OpenStreetMapService.getDataFromAddressComponents(
          result.address_components || []
        );
      return {
        place_id: result.place_id,
        name: result.formatted_address,
        city,
        lat: result.lat,
        lng: result.lng,
        country,
        country_code,
        formatted_address: result.formatted_address,
      };
    });
  }
  return Promise.reject({});
};
