import { Tooltip } from 'flowbite-react';
import ReactCountryFlag from 'react-country-flag';
import {
  FaBus,
  FaCarSide,
  FaMotorcycle,
  FaPlane,
  FaShip,
  FaTruck,
} from 'react-icons/fa';
import { pluralize, removeDuplicates } from '.';
import { Ride, Trip, VEHICLES } from '../types';
import { countries } from '../utils/country_codes';
import { secondsToTime } from './secondsToTime';

export const vehicleToIcon = (vehicle: VEHICLES) => {
  switch (vehicle) {
    case 'car':
      return <FaCarSide />;
    case 'motorcycle':
      return <FaMotorcycle />;
    case 'bus':
      return <FaBus />;
    case 'plane':
      return <FaPlane />;
    case 'boat':
      return <FaShip />;
    case 'truck':
      return <FaTruck />;
    default:
      return <FaCarSide />;
  }
};

export const vehicleIconsForRides = (rides: Ride[]) =>
  removeDuplicates(rides.map((ride, index) => ride.vehicle)).map(
    (vehicle, index) => (
      <Tooltip key={`${index}Vehicles`} content={`${vehicle} ride`}>
        {vehicle && vehicleToIcon(vehicle)}
      </Tooltip>
    )
  );

export const countryFlagsForTrip = (trip: Trip) =>
  removeDuplicates([
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
  ));

export const experiencesForRides = (rides: Ride[]) => (
  <Tooltip content={`${rides.length} ${pluralize(rides.length, 'ride')}`}>
    <div className="flex -space-x-2 items-center">
      {rides.map((ride, index) => {
        if (index >= 5) return;
        return (
          <div
            key={`${index}RideNumber`}
            className="flex items-center -space-x-2"
          >
            <div className="relative">
              <div
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
            </div>
          </div>
        );
      })}
      {rides.length > 5 && (
        <div className="relative flex h-5 w-5 items-center justify-center rounded-full bg-gray-700 text-xs font-sm ring-2 ring-gray-300 hover:bg-gray-600  dark:ring-gray-500 ">
          {rides.length}
        </div>
      )}
    </div>
  </Tooltip>
);

export const durationFromGoogle = (trip: Trip) => {
  const tripDuration = trip.arrival.seconds - trip.departure.seconds;
  const durationDiff = trip.googleDuration
    ? trip.googleDuration - tripDuration
    : 0;

  return `Google Duration: ${
    trip.googleDuration && secondsToTime(trip.googleDuration)
  }`;
};

export const tripDurationIcons = (trip: Trip) => {
  const tripDuration = trip.arrival.seconds - trip.departure.seconds;
  const humanReadableTripDuration = secondsToTime(tripDuration);
  return (
    <>
      <Tooltip content={`Trip duration: ${humanReadableTripDuration}`}>
        {humanReadableTripDuration}
      </Tooltip>
    </>
  );
};
