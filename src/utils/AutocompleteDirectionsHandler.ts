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

  constructor(
    originRef: React.RefObject<HTMLInputElement>,
    destinationRef: React.RefObject<HTMLInputElement>,
    map: google.maps.Map,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
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

    const originInput = originRef.current as HTMLInputElement;
    const destinationInput = destinationRef.current as HTMLInputElement;

    const fields = [
      'place_id',
      'geometry',
      'address_component',
      'formatted_address',
    ];

    // Specify just the place data fields that you need.
    const originAutocomplete = new google.maps.places.Autocomplete(
      originInput,
      { fields }
    );

    // Specify just the place data fields that you need.
    const destinationAutocomplete = new google.maps.places.Autocomplete(
      destinationInput,
      { fields }
    );

    this.directionsRenderer.addListener('directions_changed', () => {
      const directions = this.directionsRenderer.getDirections();
      if (
        directions &&
        directions.geocoded_waypoints &&
        directions.geocoded_waypoints.length > 2
      ) {
        console.log('directions changed');
        this.computeTotalDistance(directions);
      }
    });

    this.setupPlaceChangedListener(originAutocomplete, 'origin');
    this.setupPlaceChangedListener(destinationAutocomplete, 'destination');
  }

  getCityFromAddressComponent(
    address_component: google.maps.GeocoderAddressComponent[]
  ) {
    const city = address_component.find((component) =>
      component.types.includes('locality')
    );
    return city ? city.long_name : '';
  }

  getDataFromAddressComponent(
    address_component: google.maps.GeocoderAddressComponent[] | undefined
  ) {
    const city = address_component?.find((component) =>
      component.types.includes('locality')
    );
    const country = address_component?.find((component) =>
      component.types.includes('country')
    );
    return {
      city: city ? city.long_name : '',
      country: country ? country.long_name : '',
      country_code: country ? country.short_name : '',
    };
  }

  getCountriesForDirectionsResult(
    directionsResult: google.maps.DirectionsResult
  ) {
    const { routes } = directionsResult;
    const leg = routes[0].legs[0];
    const { steps } = leg;
    const start_country = leg.start_address.split(', ').pop();
    const end_country = leg.end_address.split(', ').pop();
    let countries: [string, number][] = [];

    if (countries.length === 0 && start_country && leg.distance)
      countries.push([start_country, leg.distance?.value]);

    if (start_country == end_country)
      return [[start_country, leg.distance?.value]];
    let distance = 0;
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const { instructions } = step;
      if (step.distance) distance += step.distance.value;
      if (instructions.includes('Entering')) {
        let country = instructions.split('Entering ').pop();
        country?.includes('</div>')
          ? (country = country.split('</div>')[0])
          : country;
        if (country) {
          countries[countries.length - 1][1] = distance;
          countries.push([country, 0]);
          distance = 0;
        }
      }
      if (i == steps.length - 1) {
        countries[countries.length - 1][1] = distance;
      }
    }
    return countries;
  }

  geocodeCountries(countries: [string, number][]) {
    const geocoder = new google.maps.Geocoder();
    const promises = countries.map((country) => {
      return new Promise((resolve, reject) => {
        geocoder.geocode({ address: country[0] }, (results, status) => {
          if (status === 'OK' && results) {
            resolve({
              country: results[0].address_components[0].long_name,
              country_code: results[0].address_components[0].short_name,
              distance: country[1],
            });
          } else {
            reject(status);
          }
        });
      });
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
    const countries = this.getCountriesForDirectionsResult(result);
    // @ts-ignore
    this.geocodeCountries(countries).then((countries) => {
      this.setFieldValue('country_distances', countries);
    });
    this.setFieldValue('totalDistance', totalDistance);
    this.setFieldValue('googleDuration', totalDuration);
  }

  setupPlaceChangedListener(
    autocomplete: google.maps.places.Autocomplete,
    mode: string
  ) {
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      const { city, country, country_code } = this.getDataFromAddressComponent(
        place.address_components as google.maps.GeocoderAddressComponent[]
      );
      const lat = place.geometry?.location?.lat();
      const lng = place.geometry?.location?.lng();

      if (!place.place_id) {
        window.alert('Please select an option from the dropdown list.');
        return;
      }

      if (mode === 'origin') {
        this.originPlaceId = place.place_id;
      } else {
        this.destinationPlaceId = place.place_id;
      }
      if (!place.geometry?.location) return;
      this.location = place.geometry.location;
      this.setFieldValue(`${mode}Name`, place.formatted_address);
      this.setFieldValue(mode, {
        placeId: place.place_id,
        lat,
        lng,
        city,
        country,
        country_code,
      });
      this.route();
    });
  }

  route() {
    if (myXOR(this.originPlaceId, this.destinationPlaceId)) {
      if (!this.location) return;
      this.map.setCenter(this.location);
      // set a marker on the map
      this.marker = new google.maps.Marker({
        position: this.location,
        map: this.map,
      });
    }

    if (!this.originPlaceId || !this.destinationPlaceId) {
      return;
    }

    const me = this;

    if (this.marker) this.marker.setMap(null);

    this.directionsService.route(
      {
        origin: { placeId: this.originPlaceId },
        destination: { placeId: this.destinationPlaceId },
        travelMode: this.travelMode,
      },
      (response, status) => {
        if (status === 'OK') {
          this.computeTotalDistance(response);
          me.directionsRenderer.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      }
    );
  }
}
