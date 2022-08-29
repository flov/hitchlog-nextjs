import React, { FC, Fragment, useEffect, useState } from 'react';
import { Ride, Trip, User } from '../../types';
import Image from 'next/image';
import { timeAgoInWords } from '../../utils/timeAgoInWords';
import RightArrow from '../svg/RightArrow';
import { Avatar, Badge, Button, Tooltip } from 'flowbite-react';
import { deleteTrip, getRidesForTrip } from '../../db/trips';
import {
  countryFlagsForTrip,
  experiencesForRides,
  tripDurationIcons,
  vehicleIconsForRides,
} from '../../utils/viewHelpers';
import { getUser } from '../../db/users';
import { photoForUser } from '../../utils';
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../utils/firebase';

const BlogCard: FC<{ trip: Trip }> = ({ trip }) => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    getUser(trip?.uid as string).then((user) => {
      setUser(user as User);
    });
    getRidesForTrip(trip.id as string)
      .then((rides) => {
        setRides(rides);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [trip.id, trip?.uid]);

  const handleDelete = () => {
    deleteTrip(trip.id as string)
      .then(() => {
        console.log('Trip deleted');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <article className="p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
      <div className="invisible space-x-3 bg-green-500 bg-green-400 bg-red-400 bg-red-600 bg-yellow-300 -space-x-3" />

      <div className="flex items-center justify-between mb-5 text-gray-500">
        <div className="flex items-center dark:text-white gap-2">
          <Badge color="purple">Trip</Badge>
          {experiencesForRides(rides)}
          {vehicleIconsForRides(rides)}
          {countryFlagsForTrip(trip)}
          {tripDurationIcons(trip)}
          <div className="flex items-center -space-x-3">
            {[].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-5 h-5 bg-green-500 border rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
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
      {rides.map((ride) => (
        <Fragment key={ride.id}>
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
                alt={`${user?.displayName}'s profile picture'`}
              />

              <span className="font-medium dark:text-white">
                {user.displayName}
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
