import { Card } from '../flowbite';
import React, { FC, useEffect, useState } from 'react';
import { BsArrowRight } from 'react-icons/bs';
import { getRidesForTrip } from '../db/trips';
import { Ride, Trip, User } from '../types';
import { staticGoogleMapUrl } from '../utils';
import { durationDiffToString, secondsToTime } from '../utils/secondsToTime';
import {
  countryFlagsForTrip,
  durationFromGoogle,
  experiencesForRides,
  tripDurationIcons,
  vehicleIconsForRides,
} from '../utils/viewHelpers';
import Link from 'next/link';
import Image from 'next/image';
import { FaGoogle } from 'react-icons/fa';
import { Tooltip } from 'flowbite-react';
import { getUser } from '../db/users';

const TripCard: FC<{ trip: Trip }> = ({ trip }) => {
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

  return (
    <div className="w-96">
      <Card>
        <div className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          <Link href={`/trips/${trip.id}`}>
            <a className="no-underline">
              {trip.origin?.city} <BsArrowRight className="inline" />{' '}
              {trip.destination?.city}
            </a>
          </Link>
        </div>

        <div>
          <Image
            className="w-24 h-24 rounded-full"
            width={96}
            height={96}
            src={
              user?.photoURL ||
              `https://robohash.org/${user?.displayName}?size=96x96&set=${
                user?.gender === 'male' ? 'set1' : 'set4'
              }`
            }
            alt={`${user?.displayName}'s profile picture'`}
          />
        </div>

        <div className="flex items-center gap-1">
          {experiencesForRides(rides)}
          {vehicleIconsForRides(rides)}
          {countryFlagsForTrip(trip)}
          {tripDurationIcons(trip)}
        </div>
      </Card>
    </div>
  );
};

export default TripCard;
