import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import Head from 'next/head';
import { ListTrips } from '../src/components/ListTrips';
import { getTrips } from '../src/db/trips';
import { Trip } from '../src/types/Trip';

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
        <title>The Hitchlog - Share your hitchhiking Experience</title>
        <meta name="description" content="Share your hitchhiking experience" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="mx-auto my-8 text-center max-w-screen-sm lg:mb-16">
          <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-gray-900 lg:text-6xl dark:text-white">
            Hitchlog
          </h1>
          <p className="font-light text-xl text-gray-500 font-bold sm:text-xl dark:text-gray-400">
            Share your hitchhiking adventure with the world
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
