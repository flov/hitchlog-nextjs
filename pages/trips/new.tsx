import { getAuth } from 'firebase/auth';
import { Formik } from 'formik';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { date, number, object, ref, string } from 'yup';
import { TripForm } from '../../src/components/TripForm';
import { IpLocation } from '../../src/types';
import { fetchLocationFromClient } from '../../src/utils';
import { getLoader } from '../../src/utils/firebase';

export const getServerSideProps: GetServerSideProps = async () => {
  const clientLocation = await fetchLocationFromClient();
  return {
    props: {
      googleMapsKey: process.env.GOOGLE_MAPS_KEY,
      clientLocation: JSON.parse(JSON.stringify(clientLocation)),
    },
  };
};

const TripSchema = object().shape({
  numberOfRides: number().required().positive().integer(),
  travellingWith: string().max(1, 'Too Long!').required('Required'),
  departure: date().max(new Date(), 'Please choose past date').required(),
  arrival: date()
    .min(ref('departure'), 'Arrival must be after departure')
    .max(new Date(), 'Please choose past date')
    .required(),
  origin: object()
    .shape({
      lat: string().required('Please select location in Dropdown menu'),
    })
    .required(),
  destination: object()
    .shape({
      lat: string().required('Please select location in Dropdown menu'),
    })
    .required(),
});

const New: NextPage<{ googleMapsKey: string; clientLocation: IpLocation }> = ({
  googleMapsKey,
  clientLocation,
}) => {
  const googlemap = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [user] = useAuthState(getAuth());

  useEffect(() => {
    const loader = getLoader(googleMapsKey);
    loader.load().then(() => {
      if (!clientLocation) return;
      const map = new google.maps.Map(googlemap.current as HTMLDivElement, {
        center: {
          lat: Number(clientLocation.latitude),
          lng: Number(clientLocation.longitude),
        },
        zoom: 6,
      });
      setMap(map);
    });
  }, [clientLocation, googleMapsKey]);

  const initialValues = {
    origin: {},
    destination: {},
    originName: '',
    destinationName: '',
    travellingWith: '0',
    numberOfRides: 0,
    arrival: '',
    departure: '',
    totalDistance: 0,
    googleDuration: 0,
  };

  return (
    <div>
      <Head>
        <title>Hitchlog - Add new trip</title>
        <meta name="description" content="Add a new hitchhiking trip" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-96" ref={googlemap} id="map"></div>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl text-center">
          Log a new hitchhiking adventure
        </h1>
        {map && user ? (
          <Formik
            component={(props) => <TripForm {...props} map={map} />}
            initialValues={initialValues}
            validationSchema={TripSchema}
            onSubmit={async (values) => {
              console.log({ values });
              window.confetti();
            }}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default New;
