import React, { FC, Fragment } from 'react';
import { Trip } from '../types';
import Image from 'next/image';
import { timeAgoInWords } from '../utils/timeAgoInWords';
import RightArrow from './svg/RightArrow';
import { Badge, Button, Tooltip } from 'flowbite-react';
import {
  countryFlagsForTrip,
  experienceCircle,
  experiencesForRides,
  showEmbeddedYoutubeVideo,
  tagsForRides,
  vehicleIconsForRides,
} from '../utils/viewHelpers';
import { getOrdinalNumber, photoForUser, profilePicture } from '../utils';
import Link from 'next/link';
import { useAuth } from './contexts/AuthContext';

const TripCard: FC<{ map?: google.maps.Map | null; trip: Trip }> = ({
  map,
  trip,
}) => {
  const centerMapToTrip = () => {
    if (map && trip.origin?.lat && trip.origin?.lng) {
      map.panTo(new google.maps.LatLng(trip.origin.lat, trip.origin.lng));
      map.setZoom(6);
    }
  };

  const { currentUser } = useAuth();

  return (
    <article
      onClick={centerMapToTrip}
      className="p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700"
    >
      <div className="invisible bg-red-400 bg-red-600 bg-yellow-300 bg-green-400 bg-green-500 space-x-3 -space-x-3" />

      <div className="flex items-center justify-between mb-2 text-gray-500">
        <div className="flex items-center gap-2 dark:text-white">
          <Badge color="info">Trip</Badge>
          {experiencesForRides(trip.rides)}
          {vehicleIconsForRides(trip.rides)}
          {countryFlagsForTrip(trip)}
        </div>
        <span className="text-sm">
          <Tooltip content={`Hitchhiked ${timeAgoInWords(trip.departure)}`}>
            {timeAgoInWords(trip.departure)}
          </Tooltip>
        </span>
      </div>
      <div className="flex items-center mb-4 gap-2 dark:text-white">
        {tagsForRides(trip.rides)}
      </div>

      <div className="flex items-center justify-between mb-2 align gap-2">
        <Link href={`/trips/${trip.id}`}>
          <a>
            From {trip.origin?.city} to {trip.destination?.city}
          </a>
        </Link>
        {currentUser && currentUser.username === trip.user.username && (
          <Link href={`/trips/${trip.id}/edit`} passHref>
            <Button size="xs">Edit</Button>
          </Link>
        )}
      </div>
      {trip.rides.map((ride, index) => (
        <Fragment key={`ride${index}`}>
          {ride.story && (
            <>
              <div className="flex items-center gap-2">
                <Tooltip content={`${ride.experience} Experience`}>
                  {experienceCircle(ride.experience, 3)}
                </Tooltip>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {ride.title
                    ? ride.title
                    : `${getOrdinalNumber(ride.number)} ride`}
                </h2>
              </div>
              {ride.story && (
                <p className="mb-5 font-light text-gray-500 dark:text-gray-400">
                  {ride.story}
                </p>
              )}
              {showEmbeddedYoutubeVideo(ride.youtube)}
            </>
          )}
        </Fragment>
      ))}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {trip.user && (
            <>
              <Link href={`/hitchhikers/${trip.user.username}`}>
                <a className="flex items-center space-x-2">
                  <Image
                    className="w-6 h-6 border border-gray-600 rounded-full"
                    width={28}
                    height={28}
                    // @ts-ignore
                    src={profilePicture(trip.user.md5_email)}
                    alt={`${trip.user.username}'s profile picture'`}
                  />
                </a>
              </Link>

              <span className="font-medium dark:text-white">
                <Link href={`/hitchhikers/${trip.user.username}`}>
                  <a className="no-underline hover:underline">
                    {trip.user.username}
                  </a>
                </Link>
              </span>
            </>
          )}
        </div>
        <Link href={`/trips/${trip.id}`}>
          <a className="inline-flex items-center font-medium no-underline text-primary-600 dark:text-primary-500 hover:underline">
            Read more
            <RightArrow />
          </a>
        </Link>
      </div>
    </article>
  );
};

export default TripCard;
