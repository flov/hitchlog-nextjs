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
import { getLoader } from '../src/utils/firebase';
import { getTrips } from '../src/db/trips';
import { Trip } from '../src/types/Trip';
import BlogCard from '../src/components/BlogCard';

export const getServerSideProps: GetServerSideProps = async () => {
  const trips = await getTrips();

  return {
    props: {
      trips: JSON.parse(JSON.stringify(trips)) as Trip[],
    },
  };
};

const Home: NextPage<{ googleMapsKey: string; trips: Trip[] }> = ({
  trips,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>The Hitchlog</title>
        <meta name="description" content="Log your hitchhiking experience" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="mx-auto mb-8 text-center max-w-screen-sm lg:mb-16">
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 lg:text-4xl dark:text-white">
            The Hitchlog
          </h1>
          <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
            Share your hitchhiking adventure with the world.
          </p>
        </div>

        <section>
          <div className="container p-4 mx-auto max-w-screen-xl">
            <ListTrips trips={trips} />
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
