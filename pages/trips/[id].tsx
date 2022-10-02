import { Loader } from '@googlemaps/js-api-loader';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { useEffect, useState } from 'react';
import { displayRoute } from '../../src/utils/DirectionsHandler';
import { HitchhikingTrip } from '../../src/components/HitchhikingTrip';
import { Trip, User } from '../../src/types';
import { GoogleAPI, GoogleApiWrapper } from 'google-maps-react';
import LoadingContainer from '../../src/components/LoadingContainer';
import { getTrip } from '../../src/db/trips_new';
import { getUser } from '../../src/db/users';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const trip = await getTrip(params?.id);
  if (!trip.data) {
    return {
      notFound: true,
    };
  }
  const user = await getUser(trip.data.user_id);

  return {
    props: {
      googleMapsKey: process.env.GOOGLE_MAPS_KEY,
      trip: JSON.parse(JSON.stringify(trip.data)),
      user: JSON.parse(JSON.stringify(user.data)),
    },
  };
};

const ShowTrip: NextPage<{
  google: GoogleAPI;
  trip: Trip;
  user: User;
}> = ({
  googleMapsKey,
  trip,
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  useEffect(() => {
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
  }, [googleMapsKey, trip.destination, trip.origin, trip.user_id]);

  return (
    <div>
      <div className="max-w-4xl px-4 py-8 mx-auto">
        <div className="w-full h-48 bg-gray-200" id="map"></div>
        {user && <HitchhikingTrip trip={trip} rides={trip.rides} user={user} />}
      </div>
    </div>
  );
};

export default GoogleApiWrapper(({ googleMapsKey }) => ({
  apiKey: googleMapsKey,
  LoadingContainer: LoadingContainer,
}))(ShowTrip);
