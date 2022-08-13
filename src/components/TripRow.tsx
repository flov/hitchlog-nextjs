import { Table, Tooltip } from 'flowbite-react';
import Link from 'next/link';
import React, { FC, useEffect, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { getRidesForTrip } from '../db/trips';
import { Ride, Trip } from '../types';
import { pluralize, removeDuplicates } from '../utils';
import { durationDiffToString, secondsToTime } from '../utils/secondsToTime';
import { countries } from '../utils/country_codes';
import { vehicleToIcon } from '../utils/viewHelpers';

const TripRow: FC<{ trip: Trip }> = ({ trip }) => {
  const tripDuration = trip.arrival.seconds - trip.departure.seconds;
  const durationDiff = trip.googleDuration
    ? trip.googleDuration - tripDuration
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
            google: {trip.googleDuration && secondsToTime(trip.googleDuration)}
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
          <Tooltip
            content={`${rides.length} ${pluralize(rides.length, 'ride')}`}
          >
            <div className="flex -space-x-2">
              {rides.map((ride, index) => (
                <div
                  key={`${index}RideNumber`}
                  className={`rounded-full border h-5 w-5 ${
                    ride.experience === 'very good'
                      ? 'bg-green-400'
                      : ride.experience === 'good'
                      ? 'bg-green-500'
                      : ride.experience === 'bad'
                      ? 'bg-red-500'
                      : ride.experience === 'very bad'
                      ? 'bg-red-600'
                      : 'bg-yellow-300'
                  }`}
                ></div>
              ))}
            </div>
          </Tooltip>

          {removeDuplicates(rides.map((ride, index) => ride.vehicle)).map(
            (vehicle, index) => (
              <Tooltip key={`${index}Vehicles`} content={`${vehicle} ride`}>
                {vehicle && vehicleToIcon(vehicle)}
              </Tooltip>
            )
          )}

          {removeDuplicates([
            trip.origin?.countryCode,
            trip.destination?.countryCode,
          ]).map((countryCode, index) => (
            <Tooltip
              //@ts-ignore
              content={`${countries[countryCode]}`}
              key={`${index}CountryCode`}
            >
              <ReactCountryFlag
                style={{ fontSize: '1.5rem' }}
                countryCode={countryCode}
              />
            </Tooltip>
          ))}
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
