import { getCountriesForResult } from './getCountriesForResult';
import { OpenStreetMapService } from './OpenStreetMapService';

import { myXOR } from '.';

export class AutocompleteDirectionsHandler {
  map: google.maps.Map;
  originPlaceId: string;
  destinationPlaceId: string;
  travelMode: google.maps.TravelMode;
  directionsService: google.maps.DirectionsService;
  directionsRenderer: google.maps.DirectionsRenderer;
  location: google.maps.LatLng | null;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  marker: google.maps.Marker | null;
  originCoordinates: { lat: number; lng: number } | null;
  destinationCoordinates: { lat: number; lng: number } | null;

  constructor(
    originRef: React.RefObject<HTMLInputElement>,
    destinationRef: React.RefObject<HTMLInputElement>,
    map: google.maps.Map,
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean,
    ) => void,
  ) {
    this.map = map;
    this.setFieldValue = setFieldValue;
    this.originPlaceId = '';
    this.destinationPlaceId = '';
    this.location = null;
    this.travelMode = google.maps.TravelMode.DRIVING;
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      draggable: true,
    });
    this.directionsRenderer.setMap(map);
    this.marker = null;
    this.originCoordinates = null;
    this.destinationCoordinates = null;

    const originInput = originRef.current as HTMLInputElement;
    const destinationInput = destinationRef.current as HTMLInputElement;

    // Set up OSM-based autocomplete for origin
    this.setupOSMAutocomplete(originInput, 'origin');
    
    // Set up OSM-based autocomplete for destination
    this.setupOSMAutocomplete(destinationInput, 'destination');

    this.directionsRenderer.addListener('directions_changed', () => {
      const directions = this.directionsRenderer.getDirections();
      if (directions && directions.geocoded_waypoints) {
        const originPlaceId = directions.geocoded_waypoints[0].place_id;
        const destinationPlaceId = directions.geocoded_waypoints[1].place_id;
        this.geocode({ placeId: originPlaceId }, 'origin');
        this.geocode({ placeId: destinationPlaceId }, 'destination');
        this.setFieldValue(
          'from_name',
          directions.routes[0].legs[0].start_address
        );
        this.setFieldValue('to_name', directions.routes[0].legs[0].end_address);
        this.computeTotalDistance(directions);
      }
    });
  }

  setupOSMAutocomplete(input: HTMLInputElement, mode: 'origin' | 'destination') {
    let debounceTimeout: NodeJS.Timeout | null = null;
    let suggestions: any[] = [];
    let showSuggestions = false;

    const createSuggestionsDropdown = () => {
      // Remove existing dropdown if any
      const existingDropdown = input.parentElement?.querySelector('.osm-suggestions');
      if (existingDropdown) {
        existingDropdown.remove();
      }

      if (!showSuggestions || suggestions.length === 0) return;

      const dropdown = document.createElement('div');
      dropdown.className = 'osm-suggestions absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto';
      
      suggestions.forEach((suggestion, index) => {
        const item = document.createElement('div');
        item.className = 'px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0';
        item.innerHTML = `
          <div class="font-medium text-sm text-gray-900">${suggestion.formatted_address}</div>
          ${suggestion.city || suggestion.country ? `<div class="text-xs text-gray-500">${[suggestion.city, suggestion.country].filter(Boolean).join(', ')}</div>` : ''}
        `;
        
        item.addEventListener('click', () => {
          this.handleOSMPlaceSelect(suggestion, mode);
          input.value = suggestion.formatted_address;
          showSuggestions = false;
          dropdown.remove();
        });
        
        dropdown.appendChild(item);
      });

      // Position dropdown
      const inputRect = input.getBoundingClientRect();
      dropdown.style.position = 'absolute';
      dropdown.style.top = '100%';
      dropdown.style.left = '0';
      dropdown.style.width = '100%';
      dropdown.style.zIndex = '1000';

      input.parentElement?.appendChild(dropdown);
    };

    const searchPlaces = async (query: string) => {
      if (query.length < 2) {
        suggestions = [];
        showSuggestions = false;
        const dropdown = input.parentElement?.querySelector('.osm-suggestions');
        if (dropdown) dropdown.remove();
        return;
      }

      try {
        suggestions = await OpenStreetMapService.searchPlaces(query, 5);
        showSuggestions = true;
        createSuggestionsDropdown();
      } catch (error) {
        console.error('Error searching places:', error);
        suggestions = [];
        showSuggestions = false;
      }
    };

    input.addEventListener('input', (e) => {
      const query = (e.target as HTMLInputElement).value;
      
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
      
      debounceTimeout = setTimeout(() => {
        searchPlaces(query);
      }, 300);
    });

    input.addEventListener('focus', () => {
      if (suggestions.length > 0) {
        showSuggestions = true;
        createSuggestionsDropdown();
      }
    });

    input.addEventListener('blur', () => {
      setTimeout(() => {
        showSuggestions = false;
        const dropdown = input.parentElement?.querySelector('.osm-suggestions');
        if (dropdown) dropdown.remove();
      }, 200);
    });
  }

  handleOSMPlaceSelect(place: any, mode: 'origin' | 'destination') {
    console.log({ place });
    const { city, country, country_code } =
      OpenStreetMapService.getDataFromAddressComponents(
        place.address_components || [],
      );
    console.log({ city, country, country_code });

    // Create a Google Maps LatLng object for the selected place
    const location = new google.maps.LatLng(place.lat, place.lng);
    this.location = location;

    if (mode === 'origin') {
      this.setFieldValue('from_name', place.formatted_address);
      this.originPlaceId = place.place_id;
      this.originCoordinates = { lat: place.lat, lng: place.lng };
    } else {
      this.setFieldValue('to_name', place.formatted_address);
      this.destinationPlaceId = place.place_id;
      this.destinationCoordinates = { lat: place.lat, lng: place.lng };
    }

    this.setFieldValue(mode, {
      place_id: place.place_id,
      lat: place.lat,
      lng: place.lng,
      city,
      country,
      country_code,
      formatted_address: place.formatted_address,
    });

    // Zoom to the selected place
    this.map.setCenter(location);
    this.map.setZoom(13);
    
    // Set a marker on the map
    if (this.marker) {
      this.marker.setMap(null);
    }
    this.marker = new google.maps.Marker({
      draggable: true,
      position: location,
      map: this.map,
    });
    
    // Add drag listener for marker
    this.marker.addListener('dragend', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        this.geocode({ location: event.latLng }, mode);
      }
    });

    this.route(mode);
  }

  getCityFromAddressComponent(
    address_component: google.maps.GeocoderAddressComponent[],
  ) {
    const city = address_component.find((component) =>
      component.types.includes('locality'),
    );
    return city ? city.long_name : '';
  }

  getDataFromAddressComponent(
    address_component: google.maps.GeocoderAddressComponent[] | undefined,
  ) {
    const city = address_component?.find((component) =>
      component.types.includes('locality'),
    );
    const country = address_component?.find((component) =>
      component.types.includes('country'),
    );
    return {
      city: city ? city.long_name : '',
      country: country ? country.long_name : '',
      country_code: country ? country.short_name : '',
    };
  }

  async geocode(
    geocoderRequest: { placeId?: string; location?: google.maps.LatLng },
    mode: 'origin' | 'destination'
  ) {
    try {
      let result;
      
      if (geocoderRequest.placeId) {
        result = await OpenStreetMapService.geocodePlace(geocoderRequest.placeId);
      } else if (geocoderRequest.location) {
        result = await OpenStreetMapService.reverseGeocode(
          geocoderRequest.location.lat(),
          geocoderRequest.location.lng()
        );
      }
      
      if (result) {
        const { city, country, country_code } = OpenStreetMapService.getDataFromAddressComponents(
          result.address_components || []
        );
        
        this.setFieldValue(mode, {
          place_id: result.place_id,
          city,
          lat: result.lat,
          lng: result.lng,
          country,
          country_code,
          formatted_address: result.formatted_address,
        });
        
        if (mode === 'origin') {
          this.originPlaceId = result.place_id;
          this.originCoordinates = { lat: result.lat, lng: result.lng };
          this.setFieldValue('from_name', result.formatted_address);
        } else {
          this.destinationPlaceId = result.place_id;
          this.destinationCoordinates = { lat: result.lat, lng: result.lng };
          this.setFieldValue('to_name', result.formatted_address);
        }
      }
    } catch (error) {
      console.error('Error geocoding:', error);
    }
  }

  async geocodeCountries(countries: [string, number][]) {
    const promises = countries.map(async (country) => {
      try {
        const results = await OpenStreetMapService.searchPlaces(country[0], 1);
        if (results.length > 0) {
          const result = results[0];
          return {
            country: result.country,
            country_code: result.country_code,
            distance: country[1],
          };
        } else {
          throw new Error('No results found');
        }
      } catch (error) {
        console.error(`Error geocoding country ${country[0]}:`, error);
        return {
          country: country[0],
          country_code: '',
          distance: country[1],
        };
      }
    });
    return Promise.all(promises);
  }

  computeTotalDistance(result: google.maps.DirectionsResult | null) {
    let totalDistance = 0;
    let totalDuration = 0;
    const myroute = result?.routes[0];

    if (!myroute || !result) return { totalDistance: 0, googleDuration: 0 };

    for (let i = 0; i < myroute.legs.length; i++) {
      totalDistance += myroute.legs[i]!.distance!.value;
      totalDuration += myroute.legs[i]!.duration!.value;
    }
    const countries = getCountriesForResult(result);
    this.geocodeCountries(countries as [string, number][]).then((countries) => {
      this.setFieldValue('country_distances', countries);
    });
    this.setFieldValue('distance', totalDistance);
    this.setFieldValue('google_duration', totalDuration);
  }

  route(mode: 'origin' | 'destination') {
    if (myXOR(this.originPlaceId, this.destinationPlaceId)) {
      if (!this.location) return;
      this.map.setCenter(this.location);
      this.map.setZoom(13);
      // set a marker on the map
      this.marker = new google.maps.Marker({
        draggable: true,
        position: this.location,
        map: this.map,
      });
      this.marker.addListener('dragend', (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          this.geocode({ location: event.latLng }, mode);
        }
      });
    }

    if (!this.originPlaceId || !this.destinationPlaceId) {
      return;
    }

    const me = this;

    if (this.marker) this.marker.setMap(null);

    // Use the stored coordinates instead of place IDs
    if (!this.originCoordinates || !this.destinationCoordinates) {
      console.log('Missing origin or destination coordinates');
      return;
    }

    this.directionsService.route(
      {
        origin: this.originCoordinates,
        destination: this.destinationCoordinates,
        travelMode: this.travelMode,
      },
      (response, status) => {
        if (status === 'OK') {
          this.computeTotalDistance(response);
          me.directionsRenderer.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      },
    );
  }
}
