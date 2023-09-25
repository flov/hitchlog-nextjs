import type { NextPage } from 'next';
import Head from 'next/head';
import { Button } from 'flowbite-react';
import { FaMap, FaUsers } from 'react-icons/fa';
import Link from 'next/link';
import { getLatestTrips, getRandomTrips } from '../src/db/trips';
import { useEffect, useState } from 'react';
import {
  RandomPhotos,
  RandomVideos,
  RandomStories,
} from '../src/components/Trips';
import Image from 'next/image';
import { timeAgoInWords } from '../src/utils/timeAgoInWords';
import { Trip } from '../src/types';
import { LatestTrips } from '@/components/Trips/LatestTrips';

const Home: NextPage = () => {
  const [latestPhotoTrips, setLatestPhotoTrips] = useState<Trip[]>([]);
  const [latestStoryTrips, setLatestStoryTrips] = useState<Trip[]>([]);
  const [latestVideoTrips, setLatestVideoTrips] = useState<Trip[]>([]);
  const [latestTrips, setLatestTrips] = useState<Trip[]>([]);

  useEffect(() => {
    latestTrips.length === 0 &&
      getLatestTrips().then((res) => {
        setLatestTrips(res.data.trips);
      });
    latestPhotoTrips.length === 0 &&
      getRandomTrips('photos').then((res) => {
        setLatestPhotoTrips(res.data.trips);
      });
    latestStoryTrips.length === 0 &&
      getRandomTrips('stories').then((res) => {
        setLatestStoryTrips(res.data.trips);
      });
    latestVideoTrips.length === 0 &&
      getRandomTrips('videos').then((res) => {
        setLatestVideoTrips(res.data.trips);
      });
  }, []);

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
        <div className="items-center px-4 mx-auto mt-4 sm:my-8 gap-16 max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-12 lg:px-6">
          <div className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
            <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-gray-900 lg:text-6xl dark:text-white">
              Hitchlog
            </h1>

            <h2 className="mb-4 text-xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
              Share your hitchhiking experience
            </h2>
            <p className="mb-4">
              Hitchhiking enables encounters that would otherwise never happen.
              It is an eventful, adventurous and free way of travelling. The
              hitchlog paints a picture of what it is like to hit the road.
            </p>
            <p className="mb-4">
              It is a platform for hitchhikers to share their experiences with
              the world. You can share your hitchhiking experience, your
              stories, your photos and your videos on a map and document your
              hitchhiking journey.
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
            <Image
              width={360}
              height={367}
              className="w-full mt-0 rounded-lg lg:mt-4"
              src="/landing_page_4.jpg"
              alt="Hitting the road 2"
            />
            <Image
              width={284}
              height={198}
              className="w-full mt-6 rounded-lg lg:mt-14"
              src="https://s3-eu-west-1.amazonaws.com/hitchlog.heroku.com/uploads/ride/25211/hitchhiking-from-hawaii-united-states-to-hawaii-united-states.jpg"
              alt="Hitting the road 1"
            />
          </div>
        </div>
      </section>

      <section className="px-4 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-screen-xl ">
          <div className="mb-8 max-w-screen-md lg:mb-16">
            <h2 className="my-4 text-2xl font-extrabold tracking-tight text-gray-900 sm:mb-4 md:text-3xl dark:text-white sm:mt-0">
              Photos, Stories and Videos of the Hitchhiking journey
            </h2>
            <p className="text-gray-500 sm:text-xl dark:text-gray-400">
              The Hitchlog paints an authentic picture of what Hitchhiking is
              like. Each trip has many rides and for each ride you can attach a
              story, a photo, a video, the type of vehicle, an experience
              ranging from very good to very bad, a tag and the gender of the
              passengers. All of this generates personal as well as global
              statistics about the hitchhiking experience.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 mx-auto bg-white max-w-screen-xl dark:bg-gray-900">
        <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-16 md:space-y-0">
          <RandomStories trips={latestStoryTrips} />
          <RandomPhotos trips={latestPhotoTrips} />
          <RandomVideos trips={latestVideoTrips} />
          <LatestTrips trips={latestTrips} />
        </div>
      </section>
    </>
  );
};

export default Home;
