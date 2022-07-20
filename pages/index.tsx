import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { useEffect } from 'react';
import { ListTrips } from '../src/components/ListTrips';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db, getLoader } from '../src/utils/firebase';
import { Trip, tripConverter } from '../src/types/Trip';

export const getServerSideProps: GetServerSideProps = async () => {
  const trips: Trip[] = [];
  const q = query(
    collection(db, 'trips').withConverter(tripConverter),
    orderBy('createdAt', 'desc'),
    limit(25)
  );

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((trip) => {
    trips.push({ ...(trip.data() as object), id: trip.id });
  });

  return {
    props: {
      googleMapsKey: process.env.GOOGLE_MAPS_KEY,
      trips: JSON.parse(JSON.stringify(trips)),
    },
  };
};

const Home: NextPage = ({
  googleMapsKey,
  trips,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  useEffect(() => {
    const loader = getLoader(googleMapsKey);
    loader.load().then((google) => {
      const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        mapTypeControl: false,
        zoom: 5,
        center: { lat: 51.3336, lng: 12.375098 }, // Leipzig.
      });
    });
  }, [googleMapsKey]);

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
