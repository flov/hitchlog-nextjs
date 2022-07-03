import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { AutocompleteDirectionsHandler } from '../src/utils/AutocompleteDirectionsHandler';
import { NewTripForm } from '../src/components/NewTripForm';

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
  useEffect(() => {
    const loader = new Loader({
      apiKey: googleMapsKey,
      version: 'weekly',
      libraries: ['places'],
    });
    let map;

    loader.load().then(() => {
      map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        mapTypeControl: false,
        zoom: 11,
        center: { lat: 51.3336, lng: 12.375098 }, // Leipzig.
      });

      new AutocompleteDirectionsHandler(map);
    });
  }, []);

  return (
    <>
      <Head>
        <title>Hitchlog</title>
        <meta name="description" content="Log your hitchhiking experience" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="w-full bg-gray-200 h-96" id="map"></div>

        <div className="mt-4">
          <h1 className={styles.title}>
            Welcome to <Link href="/">Hitchlog</Link>
          </h1>
        </div>
        {/* <CurrentUser /> */}

        <NewTripForm />
      </main>
    </>
  );
};

export default Home;
