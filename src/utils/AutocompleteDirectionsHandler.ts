import { Dispatch, MutableRefObject, SetStateAction } from 'react';

export class AutocompleteDirectionsHandler {
  map: google.maps.Map;
  originPlaceId: string;
  destinationPlaceId: string;
  travelMode: google.maps.TravelMode;
  directionsService: google.maps.DirectionsService;
  directionsRenderer: google.maps.DirectionsRenderer;
  setState: Dispatch<SetStateAction<{}>>;

  constructor(map: google.maps.Map, setState: Dispatch<SetStateAction<{}>>) {
    this.map = map;
    this.setState = setState;
    this.originPlaceId = '';
    this.destinationPlaceId = '';
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

    // Specify just the place data fields that you need.
    const originAutocomplete = new google.maps.places.Autocomplete(
      originInput,
      { fields: ['place_id', 'geometry'] }
    );

    // Specify just the place data fields that you need.
    const destinationAutocomplete = new google.maps.places.Autocomplete(
      destinationInput,
      { fields: ['place_id'] }
    );

    this.setupPlaceChangedListener(originAutocomplete, 'origin');
    this.setupPlaceChangedListener(destinationAutocomplete, 'destination');
  }

  setupPlaceChangedListener(
    autocomplete: google.maps.places.Autocomplete,
    mode: string
  ) {
    autocomplete.setFields(['address_component', 'geometry']);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
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
      this.setState((prevState) => ({
        ...prevState,
        [mode]: {
          placeId: place.place_id,
          lat,
          lng,
        },
      }));
      this.route();
    });
  }

  route() {
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
          me.directionsRenderer.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      }
    );
  }
}
