import { Loader } from '@googlemaps/js-api-loader';
import { getAuth } from 'firebase/auth';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { useEffect } from 'react';
import { getRidesForTrip, getTrip, Ride, Trip } from '../../src/db/trips';
import { getUser, User } from '../../src/db/users';
import { displayRoute } from '../../src/utils/DirectionsHandler';
import { HitchhikingTrip } from '../../src/components/HitchhikingTrip';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const trip = await getTrip(params?.id as string);
  const user = await getUser(trip?.uid as string);
  const rides = await getRidesForTrip(trip?.id as string);
  return {
    props: {
      googleMapsKey: process.env.GOOGLE_MAPS_KEY,
      trip: JSON.parse(JSON.stringify(trip)),
      user: JSON.parse(JSON.stringify(user)),
      rides: JSON.parse(JSON.stringify(rides)),
    },
  };
};

const ShowTrip: NextPage<{
  googleMapsKey: string;
  trip: Trip;
  user: User;
  rides: Ride[];
}> = ({
  googleMapsKey,
  trip,
  user,
  rides,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  console.log({rides, trip, user});
  useEffect(() => {
    const loader = new Loader({
      apiKey: googleMapsKey,
      version: 'weekly',
      libraries: ['places'],
    });

    loader.load().then((google) => {
      const map = new google.maps.Map(
        document.getElementById('map') as HTMLElement,
        {
          mapTypeControl: false,
          zoom: 11,
          center: { lat: 51.3336, lng: 12.375098 }, // Leipzig.
        }
      );
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        draggable: true,
        map,
        panel: document.getElementById('panel') as HTMLElement,
      });
      displayRoute(
        trip.origin,
        trip.destination,
        directionsService,
        directionsRenderer
      );
    });
  }, [googleMapsKey, trip.destination, trip.origin]);

  return (
    <div>
      <div className="w-full bg-gray-200 h-96" id="map"></div>
      <div className="max-w-4xl py-8 mx-auto">
        <HitchhikingTrip rides={rides} trip={trip} user={user}></HitchhikingTrip>
      </div>
    </div>
  );
};

export default ShowTrip;
