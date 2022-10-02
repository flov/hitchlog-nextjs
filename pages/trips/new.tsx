import { Alert } from 'flowbite-react';
import { Formik } from 'formik';
import { GoogleAPI, GoogleApiWrapper } from 'google-maps-react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { date, number, object, ref, string } from 'yup';
import { useAuth } from '../../src/components/contexts/AuthContext';
import LoadingContainer from '../../src/components/LoadingContainer';
import { TripForm } from '../../src/components/TripForm';
import { createTrip } from '../../src/db/trips_new';
import FlowbiteWindow from '../../src/flowbite/FlowbiteWindow';
import { showErrors } from '../../src/utils/viewHelpers';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      googleMapsKey: process.env.GOOGLE_MAPS_KEY,
    },
  };
};

const TripSchema = object().shape({
  number_of_rides: number().required().positive().integer(),
  travelling_with: string().max(1, 'Too Long!').required('Required'),
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

const New: NextPage<{ google: GoogleAPI }> = ({ google }) => {
  const googlemap = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [errors, setErrors] = useState<Record<string, any>>();
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // if (!clientLocation) return;
    const map = new google.maps.Map(googlemap.current as HTMLDivElement, {
      center: {
        lat: Number(12),
        lng: Number(42),
      },
      zoom: 6,
    });
    setMap(map);
  }, [google.maps.Map]);

  const initialValues = {
    origin: {},
    destination: {},
    originName: '',
    destinationName: '',
    travelling_with: '0',
    number_of_rides: 0,
    arrival: '',
    departure: '',
    totalDistance: 0,
    googleDuration: 0,
  };

  const handleSubmit = async (values: any) => {
    const payload = {
      trip: values,
    };
    const t = createTrip(payload)
      .then((res) => {
        window.confetti();
        router.push(`/trips/${res.data.id}/edit`);
        return res.data;
      })
      .catch((err) => {
        setErrors(err.response.data);
        console.log(err.response.data);
      });
  };

  return (
    <div>
      <Head>
        <title>Hitchlog - Log new trip</title>
        <meta name="description" content="Log a new hitchhiking trip" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-48 md:h-96" ref={googlemap} id="map"></div>
      <FlowbiteWindow>
        <h2 className="text-3xl font-extrabold tracking-tight text-center lg:text-4xl">
          Log a new hitchhiking adventure
        </h2>
        {errors && (
          <Alert color="failure">
            <span>
              <span className="font-medium">{showErrors(errors)}</span>
            </span>
          </Alert>
        )}
        {map && currentUser ? (
          <div>
            <Formik
              component={(props) => <TripForm {...props} map={map} />}
              initialValues={initialValues}
              validationSchema={TripSchema}
              onSubmit={handleSubmit}
            />
          </div>
        ) : (
          <></>
        )}
      </FlowbiteWindow>
    </div>
  );
};

export default GoogleApiWrapper(({ googleMapsKey }) => ({
  apiKey: googleMapsKey,
  LoadingContainer: LoadingContainer,
}))(New);
