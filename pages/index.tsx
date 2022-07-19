import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { NewTripForm } from '../src/components/NewTripForm';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ListTrips } from '../src/components/ListTrips';
import { Trip } from '../src/db/trips';
import {
  collection,
  CollectionReference,
  getDocs,
  limit,
  orderBy,
} from 'firebase/firestore';
import { db, getLoader } from '../src/utils/firebase';
import { query } from 'firebase/database';

export const getServerSideProps: GetServerSideProps = async () => {
  const trips: Trip[] = [];
  const q = query(
    collection(db, 'trips') as CollectionReference<Trip[]>,
    orderBy('createdAt', 'desc'),
    limit(25)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((trip) => {
    trips.push(
      JSON.parse(JSON.stringify({ ...trip.data(), id: trip.id })) as Trip
    );
  });

  return {
    props: {
      googleMapsKey: process.env.GOOGLE_MAPS_KEY,
      trips,
    },
  };
};

const Home: NextPage = ({
  googleMapsKey,
  trips,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    const loader = getLoader(googleMapsKey);
    let map;
    loader.load().then((google) => {
      map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        mapTypeControl: false,
        zoom: 5,
        center: { lat: 51.3336, lng: 12.375098 }, // Leipzig.
      });
      setMap(map);
    });
  }, [googleMapsKey]);

  const auth = getAuth();
  const [user] = useAuthState(auth);

  return (
    <>
      <Head>
        <title>Hitchlog</title>
        <meta name="description" content="Log your hitchhiking experience" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full bg-gray-200 h-96" id="map"></div>
      <main>
        <div className="container max-w-screen-xl p-4 mx-auto">
          <div className="my-4">
            <h1 className={styles.title}>
              Welcome to <Link href="/">Hitchlog</Link>
            </h1>
          </div>

          <ListTrips trips={trips} />
        </div>
      </main>
    </>
  );
};

export default Home;
