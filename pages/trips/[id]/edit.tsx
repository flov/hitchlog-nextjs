import {
  Accordion,
  Alert,
  Button,
  Label,
  Textarea,
  TextInput,
} from 'flowbite-react';
import { Field, Form, Formik, FormikValues } from 'formik';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import Head from 'next/head';
import { ChangeEvent, useEffect, useState } from 'react';
import { Experiences, Ride, Trip, Vehicles } from '../../../src/types';
import { displayRoute } from '../../../src/utils/DirectionsHandler';
import { useAuth } from '../../../src/components/contexts/AuthContext';
import { deleteTrip, getTrip, updateRide } from '../../../src/db/trips';
import { GoogleAPI, GoogleApiWrapper } from 'google-maps-react';
import LoadingContainer from '../../../src/components/LoadingContainer';
import { useRouter } from 'next/router';
import { HitchhikingTrip } from '../../../src/components/HitchhikingTrip';
import { useToasts } from '../../../src/components/contexts/ToastContext';

declare global {
  interface Window {
    confetti?: any;
  }
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const trip = await getTrip(params?.id);

  if (!trip.data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      trip: JSON.parse(JSON.stringify(trip.data)),
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
  const { addToast } = useToasts();

  useEffect(() => {
    if (currentUser?.id !== trip.user_id) {
      addToast('You are not authorized to edit this trip', {
        appearance: 'failure',
      });
      router.push('/login');
    }
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

  const changeRides = (id: string | number, name: string, value: any) => {
    const rideIndex = rides.findIndex((ride: Ride) => ride.id === id);
    let newRides = [...rides];
    if (rideIndex !== -1) {
      newRides[rideIndex] = {
        ...newRides[rideIndex],
        ...{ [name]: value },
      };
    }
    setRides(newRides);
  };

  const handleDeleteTrip = () => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      deleteTrip(trip.id).then((res) => {
        addToast('Trip deleted successfully');
        router.push('/hitchhikers/' + currentUser?.id);
      });
    }
  };

  return (
    <>
      <Head>
        <title>Hitchlog - Edit Hitchiking Trip</title>
      </Head>
      <div className="w-full h-48 bg-gray-200" id="map"></div>
      <div className="px-4 py-8 mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm_grid-edit-trip">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl">Edit Trip</h1>
              <Button size="sm" onClick={handleDeleteTrip} color="failure">
                Delete trip
              </Button>
            </div>

            <Accordion alwaysOpen={true}>
              {trip?.rides &&
                trip?.rides.map((ride: Ride, index: number) => (
                  <Accordion.Panel key={`ride${index}`}>
                    <Accordion.Title>Ride {index + 1}</Accordion.Title>
                    <Accordion.Content>
                      <Formik
                        initialValues={{
                          id: ride.id,
                          vehicle: ride.vehicle,
                          waiting_time: ride.waiting_time,
                          story: ride.story,
                          title: ride.title,
                          experience: ride.experience,
                          tag_list: ride.tags.join(', '),
                          youtube: ride.youtube,
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                          updateRide(values)
                            .then((res) => {
                              window.confetti();
                              addToast('Ride updated successfully');
                            })
                            .catch((err) => {
                              addToast(
                                'Ride not updated. Something went wrong',
                                {
                                  appearance: 'failure',
                                }
                              );
                              console.log(err);
                            });
                          setSubmitting(false);
                        }}
                      >
                        {({
                          handleSubmit,
                          handleChange,
                          handleBlur,
                          values,
                          isSubmitting,
                        }) => {
                          const handleTagListChange = (e: ChangeEvent<any>) => {
                            handleChange(e);
                            changeRides(
                              values.id,
                              'tags',
                              e.target.value.split(',')
                            );
                          };

                          const handleOnChange = (
                            e: React.ChangeEvent<any>
                          ) => {
                            handleChange(e);
                            changeRides(
                              values.id,
                              e.target.name,
                              e.target.value
                            );
                          };

                          return (
                            <Form onSubmit={handleSubmit}>
                              <div className="mb-2">
                                <Label htmlFor="title" value="Title" />
                              </div>
                              <TextInput
                                type="text"
                                placeholder="Title"
                                onChange={handleOnChange}
                                onBlur={handleBlur}
                                value={values.title}
                                name="title"
                              />
                              <div className="mt-2 ">
                                <Label htmlFor="tag_list">
                                  Tag your ride (seperated by comma)
                                </Label>
                                <div className="mt-2">
                                  <TextInput
                                    id="tag_list"
                                    name="tag_list"
                                    placeholder="Tag your ride"
                                    type="text"
                                    onChange={handleTagListChange}
                                    onBlur={handleBlur}
                                  />
                                </div>
                              </div>
                              <div className="mt-2">
                                <div className="mb-2">
                                  <Label htmlFor="story" value="My Story" />
                                </div>
                                <Textarea
                                  name="story"
                                  placeholder="Tell us your story with this ride"
                                  value={values.story}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  rows={4}
                                />
                              </div>

                              <div className="mt-2">
                                <div className="mb-2">
                                  <Label
                                    htmlFor="experience"
                                    value="Select your experience"
                                  />
                                </div>
                                <Field
                                  as="select"
                                  onChange={handleOnChange}
                                  name="experience"
                                  className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 rounded-lg p-2.5 text-sm"
                                >
                                  <option value="">Select experience</option>
                                  {Experiences.map((experience) => (
                                    <option key={experience}>
                                      {experience}
                                    </option>
                                  ))}
                                </Field>
                              </div>

                              <div className="mt-2">
                                <div className="mb-2">
                                  <Label
                                    htmlFor="vehicle"
                                    value="Select your vehicle"
                                  />
                                </div>
                                <Field
                                  as="select"
                                  onChange={handleOnChange}
                                  name="vehicle"
                                  className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 rounded-lg p-2.5 text-sm"
                                >
                                  <option>Select vehicle</option>
                                  {Vehicles.map((vehicle) => (
                                    <option key={vehicle}>{vehicle}</option>
                                  ))}
                                </Field>

                                <div className="my-2">
                                  <Label
                                    htmlFor="waiting_time"
                                    value="Waiting Time in minutes"
                                  />
                                </div>
                                <TextInput
                                  type="number"
                                  placeholder="Waiting Time"
                                  onChange={handleOnChange}
                                  onBlur={handleBlur}
                                  value={values.waiting_time}
                                  name="waiting_time"
                                />
                                <div className="my-2">
                                  <Label
                                    htmlFor="youtube"
                                    value="Video (Youtube ID)"
                                  />
                                </div>
                                <TextInput
                                  type="text"
                                  placeholder="Youtube ID"
                                  onChange={handleOnChange}
                                  onBlur={handleBlur}
                                  value={values.youtube}
                                  name="youtube"
                                />
                              </div>

                              <div className="mt-4">
                                <Button disabled={isSubmitting} type="submit">
                                  Save Ride
                                </Button>
                              </div>
                            </Form>
                          );
                        }}
                      </Formik>
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
