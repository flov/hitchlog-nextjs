import { Dispatch, SetStateAction } from 'react';
import { myXOR } from '.';

export class AutocompleteDirectionsHandler {
  map: google.maps.Map;
  originPlaceId: string;
  destinationPlaceId: string;
  travelMode: google.maps.TravelMode;
  directionsService: google.maps.DirectionsService;
  directionsRenderer: google.maps.DirectionsRenderer;
  setState: Dispatch<SetStateAction<{}>>;
  location: google.maps.LatLng | null;

  constructor(map: google.maps.Map, setState: Dispatch<SetStateAction<{}>>) {
    this.map = map;
    this.setState = setState;
    this.originPlaceId = '';
    this.destinationPlaceId = '';
    this.location = null;
    this.travelMode = google.maps.TravelMode.DRIVING;
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(map);

    const originInput = document.getElementById(
      'origin-input'
    ) as HTMLInputElement;
    const destinationInput = document.getElementById(
      'destination-input'
    ) as HTMLInputElement;

    const fields = ['place_id', 'geometry', 'address_component'];

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
    address_component: google.maps.GeocoderAddressComponent[]
  ) {
    const city = address_component.find((component) =>
      component.types.includes('locality')
    );
    const country = address_component.find((component) =>
      component.types.includes('country')
    );
    return {
      city: city ? city.long_name : '',
      country: country ? country.long_name : '',
      countryCode: country ? country.short_name : '',
    };
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

    return {
      totalDistance: totalDistance,
      googleDuration: totalDuration,
    };
  }

  setupPlaceChangedListener(
    autocomplete: google.maps.places.Autocomplete,
    mode: string
  ) {
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      const { city, country, countryCode } = this.getDataFromAddressComponent(
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
      this.setState((prevState) => ({
        ...prevState,
        [mode]: {
          placeId: place.place_id,
          lat,
          lng,
          city,
          country,
          countryCode,
        },
      }));
      this.route();
    });
  }

  route() {
    if (myXOR(this.originPlaceId, this.destinationPlaceId)) {
      if (!this.location) return
      this.map.setCenter(this.location);
      // set a marker on the map
      const marker = new google.maps.Marker({
        position: this.location,
        map: this.map,
      });
    }


    if (!this.originPlaceId || !this.destinationPlaceId) {
      return;
    }

    const me = this;

    this.directionsService.route(
      {
        origin: { placeId: this.originPlaceId },
        destination: { placeId: this.destinationPlaceId },
        travelMode: this.travelMode,
      },
      (response, status) => {
        if (status === 'OK') {
          const { totalDistance, googleDuration } =
            this.computeTotalDistance(response);
          this.setState((prevState) => ({
            ...prevState,
            totalDistance,
            googleDuration,
          }));
          me.directionsRenderer.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      }
    );
  }
}
