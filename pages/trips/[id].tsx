import { Loader } from '@googlemaps/js-api-loader';
import { getAuth } from 'firebase/auth';
import { Card } from 'flowbite-react';
import moment from 'moment';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { tripsMock } from '../../src/db/trips';
import { displayRoute } from '../../src/utils/DirectionsHandler';
import { timeAgoInWords } from '../../src/utils/timeAgoInWords';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  return {
    props: {
      id: params?.id,
      googleMapsKey: process.env.GOOGLE_MAPS_KEY,
    },
  };
};

const ShowTrip: NextPage = ({
  googleMapsKey,
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const trip = tripsMock[0];

  useEffect(() => {
    const loader = new Loader({
      apiKey: googleMapsKey,
      version: 'weekly',
      libraries: ['places'],
    });

    loader.load().then((google) => {
      const map = new google.maps.Map(
        document.getElementById('map') as HTMLElement,
        {
          mapTypeControl: false,
          zoom: 11,
          center: { lat: 51.3336, lng: 12.375098 }, // Leipzig.
        }
      );
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        draggable: true,
        map,
        panel: document.getElementById('panel') as HTMLElement,
      });
      displayRoute(
        trip.origin,
        trip.destination,
        directionsService,
        directionsRenderer
      );
    });
  }, [googleMapsKey]);

  return (
    <div>
      <div className="w-full bg-gray-200 h-96" id="map"></div>
      <div className="max-w-4xl mx-auto my-4">
        <Card>
          <div className="flex flex-col items-center pb-10">
            <img
              className="w-24 h-24 mb-3 rounded-full shadow-lg"
              src="https://flowbite.com/docs/images/people/profile-picture-3.jpg"
              alt="Bonnie image"
            />
            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white"></h5>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Visual Designer
            </span>
            <div className="flex mt-4 space-x-3 lg:mt-6">
              <a
                href="#"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Add friend
              </a>
              <a
                href="#"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
              >
                Message
              </a>
            </div>
          </div>

          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Trip from <span className="underline">{trip.origin.city}</span> to{' '}
            <span className="underline">{trip.destination.city}</span>{' '}
            hitchhiked '{moment(new Date(trip.start)).fromNow()} ago'
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Here are the biggest enterprise technology acquisitions of 2021 so
            far, in reverse chronological order.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ShowTrip;
