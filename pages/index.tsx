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
import { CurrentUser } from '../src/components/CurrentUser';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ListTrips } from '../src/components/ListTrips';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      googleMapsKey: process.env.GOOGLE_MAPS_KEY,
    },
  };
};

const Home: NextPage = ({
  googleMapsKey,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    const loader = new Loader({
      apiKey: googleMapsKey,
      version: 'weekly',
      libraries: ['places'],
    });

    let map;
    loader.load().then((google) => {
      map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        mapTypeControl: false,
        zoom: 11,
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
        <div className="container max-w-xl mx-auto">
          <div className="my-4">
            <h1 className={styles.title}>
              Welcome to <Link href="/">Hitchlog</Link>
            </h1>
          </div>

          <CurrentUser />
          {map && user ? <NewTripForm map={map} /> : <></>}
          <ListTrips />
        </div>
      </main>
    </>
  );
};

export default Home;
