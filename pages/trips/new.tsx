import { Alert } from 'flowbite-react';
import { Formik } from 'formik';
import { GoogleAPI, GoogleApiWrapper } from 'google-maps-react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { date, number, object, ref, string } from 'yup';
import { useAuth } from '../../src/components/contexts/AuthContext';
import ShowErrors from '../../src/components/helpers/ShowErrors';
import LoadingContainer from '../../src/components/LoadingContainer';
import { TripForm } from '../../src/components/TripForm';
import { createTrip } from '../../src/db/trips';
import { IpLocation } from '../../src/types';
import { fetchLocationFromClient } from '../../src/utils';

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
  }, []);

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
        <title>Hitchlog - Log a new trip</title>
        <meta name="description" content="Log a new hitchhiking trip" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="items-center justify-center md:h-full md:flex gap-4 md:flex-row md:flex-row-reverse">
        <div
          className="h-48 md:w-128 md-full-screen lg:w-1/2 md:shadow"
          ref={googlemap}
          id="map"
        ></div>

        <section className="flex flex-col items-center lg:w-1/2 sm:m-4 md:m-0">
          <div className="p-4 bg-white rounded-lg shadow lg:w-122 xl:w-144 sm:p-6 dark:border dark:bg-gray-800 dark:border-gray-700">
            <h2 className="w-full text-xl font-bold tracking-tight text-center sm:text-2xl ">
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
                  <span className="font-medium">
                    <ShowErrors errors={errors} />
                  </span>
                </span>
              </Alert>
            )}
            {map && currentUser && (
              <Formik
                component={(props) => <TripForm {...props} map={map} />}
                initialValues={{
                  origin: {},
                  destination: {},
                  country_distances: [],
                  from_name: '',
                  to_name: '',
                  travelling_with: '0',
                  number_of_rides: 1,
                  arrival: '',
                  departure: '',
                  distance: 0,
                  google_duration: 0,
                }}
                validationSchema={TripSchema}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default GoogleApiWrapper(({ googleMapsKey }) => ({
  apiKey: googleMapsKey,
  LoadingContainer: LoadingContainer,
}))(New);
