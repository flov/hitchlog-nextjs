import { Loader } from '@googlemaps/js-api-loader';
import { getAuth } from 'firebase/auth';
import {
  CollectionReference,
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import { Accordion, Card } from 'flowbite-react';
import moment from 'moment';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { fetchTrip, getTrip, Trip, tripsMock } from '../../../src/db/trips';
import { displayRoute } from '../../../src/utils/DirectionsHandler';
import { auth, db } from '../../../src/utils/firebase';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  return {
    props: {
      id: params?.id,
      googleMapsKey: process.env.GOOGLE_MAPS_KEY,
    },
  };
};

const ShowTrip: NextPage = ({
  googleMapsKey,
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [isLoading, setIsLoading] = useState<boolean>();
  const [trip, setTrip] = useState<DocumentData>();
  const [user] = useAuthState(auth);

  useEffect(() => {
    const loader = new Loader({
      apiKey: googleMapsKey,
      version: 'weekly',
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
      if (trip) {
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
      }
    });
  }, [googleMapsKey, trip]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const tripData = await getTrip(id);
      setTrip(tripData);
      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  console.log(id, trip);

  return (
    <>
      <Head>
        <title>Hitchlog - Edit Hitchiking Trip</title>
      </Head>

      <div className="w-full bg-gray-200 h-96" id="map"></div>
      <div className="max-w-4xl mx-auto">
        {isLoading && trip ? (
          <h1 className="my-4 text-2xl font-medium">Loading...</h1>
        ) : (
          <>
            <h1 className="my-4 text-2xl font-medium">
              Edit Trip from {trip?.origin?.city} to {trip?.destination?.city}
            </h1>
            <Accordion alwaysOpen={true}>
              {new Array(Number(trip?.rides)).fill(null).map((x, index) => (
                <Accordion.Panel key={`ride${index}`}>
                  <Accordion.Title>Ride {index + 1}</Accordion.Title>
                  <Accordion.Content>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                      Form content
                    </p>
                  </Accordion.Content>
                </Accordion.Panel>
              ))}
            </Accordion>
          </>
        )}
      </div>
    </>
  );
};

export default ShowTrip;
