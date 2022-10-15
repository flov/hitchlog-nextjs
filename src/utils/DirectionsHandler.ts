import { Location } from '../types';

export function displayRoute(
  origin: Location,
  destination: Location,
  service: google.maps.DirectionsService,
  display: google.maps.DirectionsRenderer
) {
  service
    .route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING,
    })
    .then((result: google.maps.DirectionsResult) => {
      display.setDirections(result);
    })
    .catch((e) => {
      alert('Could not display directions due to: ' + e);
    });
}

export class AutocompleteDirectionsHandler {
  map: google.maps.Map;
  origin: Location;
  destination: Location;
  directionsService: google.maps.DirectionsService;
  directionsRenderer: google.maps.DirectionsRenderer;

  constructor(map: google.maps.Map, origin: Location, destination: Location) {
    this.map = map;
    this.origin = origin;
    this.destination = destination;
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(map);
  }

  route() {
    if (!this.origin.place_id || !this.destination.place_id) {
      return;
    }

    const me = this;

    this.directionsService.route(
      {
        origin: { placeId: this.origin.place_id },
        destination: { placeId: this.destination.place_id },
        travelMode: google.maps.TravelMode.DRIVING,
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
