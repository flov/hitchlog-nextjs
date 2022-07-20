import { Loader } from '@googlemaps/js-api-loader';
import {
  Accordion,
} from 'flowbite-react';
import { Formik } from 'formik';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { addRideData, getTrip } from '../../../src/db/trips';
import { Ride } from '../../../src/types';
import { displayRoute } from '../../../src/utils/DirectionsHandler';
import { auth } from '../../../src/utils/firebase';
import { RideForm } from '../../../src/components/RideForm';

declare global {
  interface Window {
    confetti?: any;
  }
}

const randomInRange = (min: number, max: number) =>
  Math.random() * (max - min) + min;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const trip = await getTrip(params?.id as string);
  return {
    props: {
      trip: JSON.parse(JSON.stringify(trip)),
      googleMapsKey: process.env.GOOGLE_MAPS_KEY,
    },
  };
};

const ShowTrip: NextPage = ({
  googleMapsKey,
  trip,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [user] = useAuthState(auth);

  useEffect(() => {
    const loader = new Loader({
      apiKey: googleMapsKey,
      version: 'weekly',
    });
    loader.load().then((google) => {
      const mapElement = document.getElementById('map') as HTMLDivElement;
      if (!mapElement) return;
      const map = new google.maps.Map(mapElement, {
        mapTypeControl: false,
        zoom: 11,
        center: { lat: 51.3336, lng: 12.375098 }, // Leipzig.
      });
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        draggable: true,
        map,
      });
      displayRoute(
        trip.origin,
        trip.destination,
        directionsService,
        directionsRenderer
      );
    });
  }, [googleMapsKey, trip]);

  return (
    <>
      <Head>
        <title>Hitchlog - Edit Hitchiking Trip</title>
      </Head>

      <div className="w-full bg-gray-200 h-96" id="map"></div>
      <div className="max-w-4xl mx-auto">
        <h1 className="my-4 text-2xl font-medium">
          Edit Trip from {trip?.origin?.city} to {trip?.destination?.city}
        </h1>
        <Accordion alwaysOpen={true}>
          {new Array(Number(trip?.rides.length)).fill(null).map((x, index) => (
            <Accordion.Panel key={`ride${index}`}>
              <Accordion.Title>Ride {index + 1}</Accordion.Title>
              <Accordion.Content>
                <Formik
                  component={RideForm}
                  initialValues={{ story: '', title: '', experience: '' }}
                  onSubmit={async (values) => {
                    await addRideData(trip, values as Ride, index);
                    window.confetti({
                      angle: randomInRange(55, 125),
                      spread: randomInRange(50, 70),
                      particleCount: randomInRange(50, 100),
                      origin: { y: 0.6 },
                    });
                    console.log(values);
                  }}
                />
              </Accordion.Content>
            </Accordion.Panel>
          ))}
        </Accordion>
      </div>
    </>
  );
};

export default ShowTrip;
