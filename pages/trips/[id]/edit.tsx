import { Loader } from '@googlemaps/js-api-loader';
import {
  Accordion,
  Button,
  Label,
  Select,
  Textarea,
  TextInput,
} from 'flowbite-react';
import { Field, Formik, FormikValues } from 'formik';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { addRideData, getTrip, Ride } from '../../../src/db/trips';
import { displayRoute } from '../../../src/utils/DirectionsHandler';
import { auth } from '../../../src/utils/firebase';

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
  const confetti = require('canvas-confetti');

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

  interface InitialValues {
    story: string;
    title: string;
    experience: string;
  }

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

const RideForm = ({
  handleSubmit,
  handleChange,
  handleBlur,
  values,
  errors,
}: FormikValues) => {
  console.log(values);
  return (
    <form onSubmit={handleSubmit}>
      <div className="block mb-2">
        <Label htmlFor="title" value="Title" />
      </div>
      <TextInput
        id="title"
        type="text"
        placeholder="Title"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.title}
        name="title"
      />

      <div id="textarea" className="mt-2">
        <div className="block mb-2">
          <Label htmlFor="story" value="My Story" />
        </div>
        <Textarea
          id="story"
          name="story"
          placeholder="Write something about your hitchhiking encounter..."
          onChange={handleChange}
          onBlur={handleBlur}
          rows={4}
        />
      </div>

      <div id="select" className="mt-2">
        <div className="block mb-2">
          <Label htmlFor="experience" value="Select your experience" />
        </div>
        <Select
          id="experience"
          defaultValue={'good'}
          required={true}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.experience}
        >
          <option>very good</option>
          <option>good</option>
          <option>neutral</option>
          <option>bad</option>
          <option>very bad</option>
        </Select>
      </div>

      {errors.name && <div>{errors.name}</div>}
      <div className="mt-4">
        <Button type="submit">Save Ride</Button>
      </div>
    </form>
  );
};

export default ShowTrip;
