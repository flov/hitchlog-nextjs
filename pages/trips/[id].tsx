import { Loader } from '@googlemaps/js-api-loader';
import { getAuth } from 'firebase/auth';
import { Badge, Card, Timeline } from 'flowbite-react';
import moment from 'moment';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import Image from 'next/image';
import { useEffect } from 'react';
import { EXPERIENCES, getTrip, Ride, Trip } from '../../src/db/trips';
import { getUser } from '../../src/db/users';
import { displayRoute } from '../../src/utils/DirectionsHandler';
import { BsArrowRight } from 'react-icons/bs';
import { experienceToColor } from '../../src/utils';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const trip = await getTrip(params?.id as string);
  const user = await getUser(trip?.uid as string);
  console.log(user);
  return {
    props: {
      id: params?.id,
      googleMapsKey: process.env.GOOGLE_MAPS_KEY,
      t: JSON.parse(JSON.stringify(trip)),
      user,
    },
  };
};

const ShowTrip: NextPage = ({
  googleMapsKey,
  t,
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const trip = t as Trip;
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
  }, [googleMapsKey, trip.destination, trip.origin]);

  return (
    <div>
      <div className="w-full bg-gray-200 h-96" id="map"></div>
      <div className="max-w-4xl mx-auto my-8">
        <Card>
          <div className="flex flex-col items-center text-center ">
            <Image
              className="w-24 h-24 mb-3 rounded-full shadow-lg"
              width={96}
              height={96}
              src={user.photoURL}
              alt={`Avatar from ${user.displayName}`}
            />
            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white"></h5>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Hitchhiked by {user.displayName.split(' ')[0]}
            </span>
          </div>

          <h5 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Trip from {trip.origin.city} <BsArrowRight className="inline" />{' '}
            {trip.destination.city} hitchhiked{' '}
            {moment(new Date(trip.start)).fromNow()}
          </h5>
          <Timeline>
            {trip.rides.map((ride, index) => (
              <Timeline.Item key={`ride${index}`}>
                <Timeline.Point />
                <Timeline.Content>
                  <Timeline.Time>
                    Ride {index + 1}{' '}
                    <span className="inline">
                      <Badge className="inline" color={experienceToColor(ride.experience as EXPERIENCES)}>
                      {ride.experience}
                      </Badge>
                    </span>
                  </Timeline.Time>
                  <Timeline.Title>{ride.title}</Timeline.Title>
                  <Timeline.Body>{ride.story}</Timeline.Body>
                </Timeline.Content>
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>
      </div>
    </div>
  );
};

export default ShowTrip;
