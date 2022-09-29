import React, { FC, Fragment } from 'react';
import { Trip } from '../../types';
import Image from 'next/image';
import { timeAgoInWords } from '../../utils/timeAgoInWords';
import RightArrow from '../svg/RightArrow';
import { Badge, Tooltip } from 'flowbite-react';
import {
  countryFlagsForTrip,
  experiencesForRides,
  tripDurationIcons,
  vehicleIconsForRides,
} from '../../utils/viewHelpers';
import { photoForUser } from '../../utils';
import Link from 'next/link';

const BlogCard: FC<{ trip: Trip }> = ({ trip }) => {
  const { rides, user } = trip;

  return (
    <article className="p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
      <div className="invisible bg-red-400 bg-red-600 bg-yellow-300 bg-green-400 bg-green-500 space-x-3 -space-x-3" />

      <div className="flex items-center justify-between mb-5 text-gray-500">
        <div className="flex items-center gap-2 dark:text-white">
          <Badge color="purple">Trip</Badge>
          {experiencesForRides(rides)}
          {vehicleIconsForRides(rides)}
          {countryFlagsForTrip(trip)}
          {tripDurationIcons(trip)}
        </div>

        <span className="text-sm">
          <Tooltip content={`Hitchhiked ${timeAgoInWords(trip.departure)}`}>
            {timeAgoInWords(trip.departure)}
          </Tooltip>
        </span>
      </div>
      <h3 className="flex items-center justify-between mb-4 font-bold text-1xl">
        <span>
          From {trip.origin?.city} to {trip.destination?.city}
        </span>
      </h3>
      {rides.map((ride, index) => (
        <Fragment key={`ride${index}`}>
          {ride.story && (
            <>
              <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                {ride.title
                  ? ride.title
                  : `${trip.origin?.city} to ${trip.destination?.city}`}
              </h2>
              {ride.story && (
                <p className="mb-5 font-light text-gray-500 dark:text-gray-400">
                  {ride.story}
                </p>
              )}
            </>
          )}
        </Fragment>
      ))}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {user && (
            <>
              <Image
                className="w-6 h-6 rounded-full"
                width={28}
                height={28}
                src={photoForUser(user, '28x28')}
                alt={`${user.username}'s profile picture'`}
              />

              <span className="font-medium dark:text-white">
                {user.username}
              </span>
            </>
          )}
        </div>
        <Link href={`/trips/${trip.id}`}>
          <a className="inline-flex items-center font-medium text-primary-600 dark:text-primary-500 hover:underline">
            Read more
            <RightArrow />
          </a>
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
