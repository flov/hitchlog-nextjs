import type { NextPage } from 'next';
import Head from 'next/head';
import { Button } from 'flowbite-react';
import { useRouter } from 'next/router';
import { FaMap, FaUsers } from 'react-icons/fa';
import Link from 'next/link';

const Home: NextPage = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Hitchlog - Share your hitchhiking experience</title>
        <meta
          name="description"
          content="Share your hitchhiking experience. The hitchlog is like a logbook for hitchhikers"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="bg-white dark:bg-gray-900">
        <div className="items-center px-4 py-8 mx-auto gap-16 max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
          <div className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
            <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-gray-900 lg:text-6xl dark:text-white">
              Hitchlog
            </h1>

            <h2 className="mb-4 text-xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
              Share your hitchhiking experience
            </h2>
            <p className="mb-4">
              Hitchhiking enables encounters that would otherwise never happen.
              It is an eventful, adventurous and free way of travelling.
            </p>
            <p className="mb-4">
              The hitchlog is a platform for hitchhikers to share their
              experiences with the world. It works like a blog for hitchhikers.
              You can share your hitchhiking experience, your stories, your
              photos and your videos on a map and document your hitchhiking
              journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link passHref href={'/register'}>
                <Button>Sign up</Button>
              </Link>
              <div className="flex flex-col sm:flex-row gap-2">
                <Link
                  passHref
                  href={'/trips?q=%7B"rides_story_present"%3Atrue%7D'}
                >
                  <Button color="gray">
                    <div className="flex items-center gap-2">
                      <FaMap /> Explore Trips
                    </div>
                  </Button>
                </Link>
                <Link passHref href={'/hitchhikers'}>
                  <Button color="gray">
                    <div className="flex items-center gap-2">
                      <FaUsers /> Explore Hitchhikers
                    </div>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <img
              className="w-full rounded-lg"
              src="https://s3-eu-west-1.amazonaws.com/hitchlog.heroku.com/uploads/ride/25211/hitchhiking-from-hawaii-united-states-to-hawaii-united-states.jpg"
              alt="Hitting the road"
            />
            <img
              className="w-full mt-4 rounded-lg lg:mt-10"
              src="/landing_page_2.png"
              alt="office content 2"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
