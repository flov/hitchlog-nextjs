import { Accordion } from 'flowbite-react';
import { Formik } from 'formik';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Ride, Trip } from '../../../src/types';
import { displayRoute } from '../../../src/utils/DirectionsHandler';
import { RideForm } from '../../../src/components/RideForm';
import { useAuth } from '../../../src/components/contexts/AuthContext';
import { getTrip, updateRide } from '../../../src/db/trips_new';
import { GoogleAPI, GoogleApiWrapper } from 'google-maps-react';
import LoadingContainer from '../../../src/components/LoadingContainer';
import { useRouter } from 'next/router';
import { HitchhikingTrip } from '../../../src/components/HitchhikingTrip';

declare global {
  interface Window {
    confetti?: any;
  }
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { data } = await getTrip(params?.id);
  return {
    props: {
      trip: JSON.parse(JSON.stringify(data)),
      googleMapsKey: process.env.GOOGLE_MAPS_KEY,
    },
  };
};

const ShowTrip: NextPage<{ trip: Trip; google: GoogleAPI }> = ({
  google,
  trip,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { currentUser } = useAuth();
  const router = useRouter();

  const [rides, setRides] = useState<Ride[]>(trip?.rides);

  useEffect(() => {
    if (currentUser?.id !== trip.user_id) router.push('/login');
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
  }, [
    currentUser?.id,
    google.maps.DirectionsRenderer,
    google.maps.DirectionsService,
    google.maps.Map,
    router,
    trip.destination,
    trip.origin,
    trip.user_id,
  ]);

  // const changeRides = (values: Ride[]) => {
  // const rideIndex = rides.findIndex((ride: Ride) => ride.id === values.id);
  // let newRides = [...rides];
  // if (rideIndex !== -1) {
  // newRides[rideIndex] = {
  // ...newRides[rideIndex],
  // ...values,
  // };
  // }
  // setRides(newRides);
  // };
  //

  return (
    <>
      <Head>
        <title>Hitchlog - Edit Hitchiking Trip</title>
      </Head>

      <div className="w-full bg-gray-200 h-96" id="map"></div>
      <div className="px-4 py-8 mx-auto max-w-7xl">
        <div className="grid-edit-trip">
          <div>
            <Accordion alwaysOpen={true}>
              {trip?.rides &&
                trip?.rides.map((ride: Ride, index: number) => (
                  <Accordion.Panel key={`ride${index}`}>
                    <Accordion.Title>Ride {index + 1}</Accordion.Title>
                    <Accordion.Content>
                      <Formik
                        component={(props) => (
                          <RideForm {...props} rides={trip.rides} ride={ride} />
                        )}
                        initialValues={{
                          id: ride.id,
                          vehicle: ride.vehicle,
                          waiting_time: ride.waiting_time,
                          story: ride.story,
                          title: ride.title,
                          experience: ride.experience,
                        }}
                        onSubmit={async (values) => {
                          await updateRide(values);
                        }}
                      />
                    </Accordion.Content>
                  </Accordion.Panel>
                ))}
            </Accordion>
          </div>
          <div>
            {currentUser && (
              <HitchhikingTrip trip={trip} rides={rides} user={currentUser} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GoogleApiWrapper(({ googleMapsKey }) => ({
  apiKey: googleMapsKey,
  LoadingContainer: LoadingContainer,
}))(ShowTrip);
