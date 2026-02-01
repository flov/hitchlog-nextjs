import { GoogleAPI, GoogleApiWrapper } from 'google-maps-react';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import Head from 'next/head';
import React, { useEffect } from 'react';

import { HitchhikingTrip } from '../../src/components/HitchhikingTrip';
import LoadingContainer from '../../src/components/LoadingContainer';
import { getTrip } from '../../src/db/trips';
import { getUser } from '../../src/db/users';
import { Trip, User } from '../../src/types';
import { displayOSRMRoute } from '../../src/utils/OSRMRouteService';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  // params.id looks like: hitchhike-from-${fromCity}-to-${toCity}-${id}
  const paramId = params?.id as string;
  const idArray = paramId.split('-');
  try {
    const trip = await getTrip(idArray[idArray.length - 1]);
    const user = await getUser(trip.data.user_id);

    return {
      props: {
        googleMapsKey: process.env.GOOGLE_MAPS_KEY,
        trip: JSON.parse(JSON.stringify(trip.data)),
        user: JSON.parse(JSON.stringify(user.data)),
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
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
    if (trip.origin?.lat != null && trip.destination?.lat != null) {
      displayOSRMRoute(map, trip.origin, trip.destination);
    }
  }, [trip]);

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
