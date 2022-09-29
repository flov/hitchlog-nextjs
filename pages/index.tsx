import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import Head from 'next/head';
import { ListTrips } from '../src/components/ListTrips';
import { getTrips } from '../src/db/trips_new';
import { Trip } from '../src/types/Trip';

export const getServerSideProps: GetServerSideProps = async () => {
  const trips = await getTrips();

  return {
    props: {
      trips: JSON.parse(JSON.stringify(trips)) as Trip[],
    },
  };
};

const Home: NextPage<{ trips: Trip[] }> = ({
  trips,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>The Hitchlog - Share your hitchhiking experience</title>
        <meta
          name="description"
          content="Share your hitchhiking experience. The hitchlog is like a logbook for hitchhikers"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="py-8 mx-auto text-center max-w-screen-sm lg:mb-16">
          <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-gray-900 lg:text-6xl dark:text-white">
            Hitchlog
          </h1>
          <p className="text-xl font-light font-bold text-gray-500 sm:text-xl dark:text-gray-400">
            Share your hitchhiking adventure with the world
          </p>
        </div>
      </main>
    </>
  );
};

export default Home;
