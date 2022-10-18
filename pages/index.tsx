import dynamic from 'next/dynamic';
import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
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
          <div className="h-4 mt-8 bg-purple-500 rounded-full bg-gradient-to-l md:bg-gradient-to-r hover:bg-gradient-to-r from-purple-500 to-pink-500"></div>
        </div>
      </main>
    </>
  );
};

export default Home;
