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
import { getTrip } from '../../src/db/trips';
import { getUser } from '../../src/db/users';
import Head from 'next/head';
import { Alert, Spinner } from 'flowbite-react';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  // params.id looks like: hitchhike-from-${fromCity}-to-${toCity}-${id}
  const paramId = params?.id as string;
  const idArray = paramId.split('-');

  return {
    props: {
      googleMapsKey: process.env.GOOGLE_MAPS_KEY,
      id: idArray[idArray.length - 1],
    },
  };
};

const ShowTrip: NextPage<{
  google: GoogleAPI;
  id: string;
}> = ({
  googleMapsKey,
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [trip, setTrip] = useState<Trip>();
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTripAndUser = async () => {
      setIsLoading(true);
      const res = await getTrip(id);
      setTrip(res.data);
      const userRes = await getUser(res.data.user_id);
      setUser(userRes.data);
      setIsLoading(false);
    };
    fetchTripAndUser();
  }, []);

  useEffect(() => {
    if (!trip) {
      return;
    }
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
      map,
      panel: document.getElementById('panel') as HTMLElement,
    });
    displayRoute(
      trip.origin,
      trip.destination,
      directionsService,
      directionsRenderer
    );
  }, [googleMapsKey, trip]);

  if (!isLoading || !trip) {
    return (
      <div className="max-w-4xl p-4 mx-auto">
        {isLoading ? (
          <Spinner />
        ) : (
          <Alert color="info">This trip does not exist</Alert>
        )}
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>
          {`Hitchlog - Hitchhiking from ${trip.origin.city} to ${trip.destination.city}`}
        </title>
      </Head>
      <div className="w-full h-48 bg-gray-200" id="map"></div>
      <div className="max-w-4xl px-4 py-4 mx-auto">
        {user && <HitchhikingTrip trip={trip} rides={trip.rides} user={user} />}
      </div>
    </div>
  );
};

export default GoogleApiWrapper(({ googleMapsKey }) => ({
  apiKey: googleMapsKey,
  LoadingContainer: LoadingContainer,
}))(ShowTrip);
