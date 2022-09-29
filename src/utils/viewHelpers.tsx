import { Tooltip } from 'flowbite-react';
import ReactCountryFlag from 'react-country-flag';
import { BsSpeedometer } from 'react-icons/bs';
import { CgSandClock } from 'react-icons/cg';
import {
  FaBus,
  FaCarSide,
  FaGoogle,
  FaMotorcycle,
  FaPlane,
  FaScroll,
  FaShip,
  FaTruck,
} from 'react-icons/fa';
import { FiThumbsUp, FiUser } from 'react-icons/fi';
import { capitalize, pluralize, removeDuplicates } from '.';
import { Ride, Trip, User, VEHICLES } from '../types';
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
      <>
        {vehicle && (
          <Tooltip key={`${index}Vehicles`} content={`${vehicle} ride`}>
            {vehicleToIcon(vehicle)}
          </Tooltip>
        )}
      </>
    )
  );

export const countryFlagsForTrip = (trip: Trip) =>
  removeDuplicates([
    trip.origin?.country_code,
    trip.destination?.country_code,
  ]).map((country_code, index) => (
    <Tooltip
      //@ts-ignore
      content={`${countries[country_code]}`}
      key={`${index}CountryCode`}
    >
      <ReactCountryFlag
        style={{ fontSize: '1.5rem' }}
        countryCode={country_code}
      />
    </Tooltip>
  ));

export const experiencesForRides = (rides: Ride[]) => (
  <>
    {!!rides?.length && (
      <Tooltip
        content={`${rides.length} ${pluralize(
          rides.length,
          'ride'
        )}: ${removeDuplicates(rides.map((x) => x.experience)).join(', ')}`}
      >
        <div className="flex items-center -space-x-3">
          {rides.map((ride, index) => {
            if (index >= 5) return;
            return (
              <div
                key={`${index}RideNumber`}
                className="flex items-center space-x-3"
              >
                <div className="relative">
                  <div
                    className={`rounded-full border h-5 w-5 ${
                      ride.experience === 'very good'
                        ? 'bg-green-400'
                        : ride.experience === 'good'
                        ? 'bg-green-500'
                        : ride.experience === 'bad'
                        ? 'bg-red-400'
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
            <div className="relative flex items-center justify-center w-5 h-5 text-xs bg-gray-700 rounded-full font-sm ring-2 ring-gray-300 hover:bg-gray-600 dark:ring-gray-500 ">
              {rides.length}
            </div>
          )}
        </div>
      </Tooltip>
    )}
  </>
);

export const durationFromGoogle = (trip: Trip) => {
  const tripDuration = trip.arrival.seconds - trip.departure.seconds;
  const durationDiff = trip.google_duration
    ? trip.google_duration - tripDuration
    : 0;

  return `Google Duration: ${
    trip.google_duration && secondsToTime(trip.google_duration)
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

export const showErrors = (errors: Record<string, string[]>) =>
  Object.keys(errors).map((key) => (
    <ul key={key}>
      <li>
        {key}: {errors[key].join(' ')}{' '}
      </li>
    </ul>
  ));

export const showVehiclesForRides = (rides: Ride[]) =>
  removeDuplicates(rides.map((ride) => ride.vehicle))
    .filter((x) => x != null)
    .map((ride) => vehicleToIcon(ride));

export const showTotalWaitingTimeForRides = (rides: Ride[]) => {
  const totalWaitingTime = rides
    .map((ride) => ride.waiting_time)
    .filter((x) => x)
    .reduce((a, b) => a + b, 0);

  if (!totalWaitingTime) return;
  return (
    <Tooltip content={`Total waiting time: ${totalWaitingTime} minutes`}>
      <CgSandClock className="inline" />
      {totalWaitingTime}m
    </Tooltip>
  );
};

export const showAgeAtTrip = (trip: Trip, user: User) => {
  if (!trip.age_at_trip) return;
  return (
    <Tooltip
      content={`${capitalize(user.username)} was ${trip.age_at_trip} when ${
        user.gender === 'male' ? 'he' : 'she'
      } did the trip`}
    >
      <FiUser className="inline" />
      {trip.age_at_trip} years
    </Tooltip>
  );
};

export const showNumberOfRides = (rides: Ride[]) => (
  <Tooltip content={`${rides.length} ${pluralize(rides.length, 'ride')}`}>
    <FiThumbsUp className="inline " /> {rides.length}
  </Tooltip>
);

export const showNumberOfStories = (rides: Ride[]) => {
  const numberOfStories = rides
    .map((x) => x.story)
    .filter((story) => story != null || story == '').length;
  console.log({ numberOfStories });
  return (
    <Tooltip
      content={`${numberOfStories} ${pluralize(numberOfStories, 'story')}`}
    >
      <FaScroll className="inline" /> {numberOfStories}
    </Tooltip>
  );
};

export const showTripDistance = (trip: Trip) => {
  if (trip.distance) {
    return (
      <Tooltip
        content={`travelled ${trip.distance} kms with an average speed of ${trip.average_speed}`}
      >
        <BsSpeedometer className="inline" />
        {trip.distance} kms/{trip.average_speed} km/h
      </Tooltip>
    );
  }
};

export const showTripGoogleDuration = (trip: Trip) => {
  const google_duration = trip.google_duration;
  if (google_duration) {
    return (
      <Tooltip
        content={`Google Maps duration: ${secondsToTime(google_duration)}`}
      >
        <FaGoogle />
        {secondsToTime(google_duration)}
      </Tooltip>
    );
  }
};
