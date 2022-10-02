import { Table } from 'flowbite-react';
import Link from 'next/link';
import React, { FC, useEffect, useState } from 'react';
import { getRidesForTrip } from '../db/trips';
import { Ride, Trip } from '../types';
import { durationDiffToString, secondsToTime } from '../utils/secondsToTime';
import {
  countryFlagsForTrip,
  experiencesForRides,
  vehicleIconsForRides,
} from '../utils/viewHelpers';

const TripRow: FC<{ trip: Trip }> = ({ trip }) => {
  const tripDuration = trip.arrival.seconds - trip.departure.seconds;
  const durationDiff = trip.google_duration
    ? trip.google_duration - tripDuration
    : 0;
  const [rides, setRides] = useState<Ride[]>([]);

  useEffect(() => {
    getRidesForTrip(trip.id as string)
      .then((rides) => {
        setRides(rides);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [trip.id]);

  return (
    <Table.Row
      key={trip.id}
      className="bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
        {trip.origin?.city}
      </Table.Cell>
      <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
        {trip.destination?.city}
      </Table.Cell>
      <Table.Cell>
        <div className="flex flex-col">
          <p>Trip duration: {secondsToTime(tripDuration)}</p>
          <p className="text-xs text-gray-500">
            google:{' '}
            {trip.google_duration && secondsToTime(trip.google_duration)}
          </p>
          {durationDiff && (
            <p className="text-xs text-gray-500">
              {durationDiff && durationDiffToString(durationDiff)}{' '}
            </p>
          )}
        </div>
      </Table.Cell>
      <Table.Cell>
        <div className="flex items-center gap-1">
          {experiencesForRides(rides)}
          {vehicleIconsForRides(rides)}
          {countryFlagsForTrip(trip)}
        </div>
      </Table.Cell>
      <Table.Cell>
        <Link
          href={`/trips/${trip.id}`}
          className="font-medium text-blue-600 hover:underline dark:text-blue-500"
        >
          Show
        </Link>
      </Table.Cell>
    </Table.Row>
  );
};

export default TripRow;