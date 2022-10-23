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
import { createTrip } from '../../src/db/trips';
import { IpLocation } from '../../src/types';
import { fetchLocationFromClient } from '../../src/utils';
import { showErrors } from '../../src/utils/viewHelpers';

export const getServerSideProps: GetServerSideProps = async () => {
  const ipLocation = await fetchLocationFromClient();

  return {
    props: {
      googleMapsKey: process.env.GOOGLE_MAPS_KEY,
      ipLocation,
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

const New: NextPage<{ google: GoogleAPI; ipLocation: IpLocation }> = ({
  ipLocation,
  google,
}) => {
  const googlemap = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [errors, setErrors] = useState<Record<string, any>>();
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const map = new google.maps.Map(googlemap.current as HTMLDivElement, {
      center: {
        lat: Number(ipLocation?.latitude ? ipLocation.latitude : 0),
        lng: Number(ipLocation?.longitude ? ipLocation.longitude : 0),
      },
      zoom: 4,
    });
    setMap(map);
  }, [google.maps.Map]);

  const initialValues = {
    origin: {},
    destination: {},
    country_distances: [],
    from_name: '',
    to_name: '',
    travelling_with: '0',
    number_of_rides: 1,
    arrival: '',
    departure: '',
    totalDistance: 0,
    googleDuration: 0,
  };

  const handleSubmit = async (values: any) => {
    const payload = {
      trip: values,
    };
    createTrip(payload)
      .then((res) => {
        router.push(`/trips/${res.data.id}/edit`);
        return res.data;
      })
      .catch((err) => {
        setErrors(err.response.data);
      });
  };

  return (
    <div>
      <Head>
        <title>Hitchlog - Log new trip</title>
        <meta name="description" content="Log a new hitchhiking trip" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-48 md:h-80" ref={googlemap} id="map"></div>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center mx-auto">
          <div className="w-full max-w-2xl p-4 bg-white rounded-lg shadow sm:m-6 sm:p-6 dark:border dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-xl font-bold tracking-tight text-center sm:text-2xl ">
              Log a new hitchhiking adventure
            </h2>
            {!currentUser && (
              <div className="mt-4">
                <Alert color="info">
                  <span className="font-medium">
                    You need to be logged in to log a trip, please log in
                  </span>
                </Alert>
              </div>
            )}
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default GoogleApiWrapper(({ googleMapsKey }) => ({
  apiKey: googleMapsKey,
  LoadingContainer: LoadingContainer,
}))(New);
