import { Badge, Tooltip } from 'flowbite-react';
import ReactCountryFlag from 'react-country-flag';
import { BsArrowRight, BsChat, BsClock, BsSpeedometer } from 'react-icons/bs';
import { CgSandClock } from 'react-icons/cg';
import {
  FaArrowRight,
  FaBus,
  FaCarSide,
  FaGoogle,
  FaMars,
  FaMarsStrokeV,
  FaMotorcycle,
  FaPlane,
  FaRoad,
  FaScroll,
  FaShip,
  FaTruck,
  FaVenus,
} from 'react-icons/fa';
import { FiThumbsUp, FiUser } from 'react-icons/fi';
import { capitalize, pluralize, removeDuplicates } from '.';
import ExperienceCircle from '../components/helpers/ExperienceCircle';
import {
  ExperienceKey,
  ExperiencesRecord,
  Profile,
  Ride,
  Trip,
  User,
  VEHICLE,
} from '../types';
import { countries } from '../utils/country_codes';
import { calculateTimeBetweenDates } from './calculateTimeBetweenDates';
import { secondsToTime } from './secondsToTime';

export const vehicleToIcon = (vehicle: VEHICLE) => {
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
  removeDuplicates(rides.map((ride) => ride.vehicle)).map((vehicle, index) => (
    <>
      {vehicle && (
        <Tooltip key={`${index}Vehicles`} content={`${vehicle} ride`}>
          {vehicleToIcon(vehicle)}
        </Tooltip>
      )}
    </>
  ));

export const showCountryFlagForUser = (
  user: User | Profile | undefined | null
) => {
  if (!user?.location?.country_code) return null;
  return countryFlag(user.location.country_code, user.location.city);
};

export const countryFlag = (countryCode: string | undefined, tip = '') => {
  if (!countryCode) return null;
  return (
    <Tooltip
      //@ts-ignore
      content={`${tip ? tip : countries[countryCode.toUpperCase()]}`}
    >
      <ReactCountryFlag
        style={{ fontSize: '1.5rem' }}
        countryCode={countryCode}
      />
    </Tooltip>
  );
};

export const countryFlagsForProfile = (
  hitchhiked_countries: Record<string, number>
) => {
  if (!hitchhiked_countries) return null;
  return (
    <>
      {Object.keys(hitchhiked_countries).map((countryCode, index) => {
        if (!countryCode) return null;
        return (
          <Tooltip
            key={`${index}CountryFlag`}
            //@ts-ignore
            content={`${countries[countryCode.toUpperCase()]}: ${Math.round(
              hitchhiked_countries[countryCode] / 1000
            )} kms`}
          >
            <ReactCountryFlag
              style={{ fontSize: '1.5rem' }}
              countryCode={countryCode}
            />
          </Tooltip>
        );
      })}
    </>
  );
};

export const countryFlagsForTrip = (trip: Trip) =>
  trip.country_distances.map((cd) =>
    countryFlag(
      cd.country_code,
      `${cd.country}: ${Math.round(cd.distance / 1000)} km`
    )
  );

export const experiencesForProfile = (experiences: ExperiencesRecord) => {
  if (!experiences) return null;
  return Object.keys(experiences).map((exp, index) => {
    const replaced_exp = exp.replace(/_/g, ' ');
    const experienceSize = experiences[exp as ExperienceKey];
    const array = new Array(experienceSize).fill(0);
    return (
      <Tooltip
        key={`${index}Experience`}
        content={`${experienceSize} ${pluralize(
          experienceSize,
          `${replaced_exp} experience`
        )}`}
      >
        <div className="flex items-center -space-x-3">
          {array.map((_, index) => {
            if (index > 5) return null;
            return (
              <div
                key={`${index}RideNumber`}
                className="flex items-center space-x-3"
              >
                <div className="relative">
                  <ExperienceCircle experience={replaced_exp} />
                </div>
              </div>
            );
          })}
          {array.length > 0 && (
            <div className="relative flex items-center justify-center w-5 h-5 text-xs text-white bg-gray-700 rounded-full font-sm ring-2 ring-gray-300 hover:bg-gray-600 dark:ring-gray-500 ">
              {array.length}
            </div>
          )}
        </div>
      </Tooltip>
    );
  });
};

export const showErrors = (errors: Record<string, string[]> | string) => {
  if (typeof errors === 'string') return <>errors</>;
  if (Object.keys(errors).length === 0) return null;
  return (
    <>
      {Object.keys(errors).map((key) => (
        <ul key={key}>
          <li>
            {key}: {errors[key]?.join(' ')}{' '}
          </li>
        </ul>
      ))}
    </>
  );
};

export const showVehiclesForRides = (rides: Ride[]) =>
  removeDuplicates(rides.map((ride) => ride.vehicle))
    .filter((x) => x != null)
    .map((ride) => vehicleToIcon(ride));

export const showTotalWaitingTimeForRides = (rides: Ride[]) => {
  const totalWaitingTime = rides
    .map((ride) => ride.waiting_time)
    .filter((x) => x)
    // @ts-ignore
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
      <div className="flex items-center">
        <FiUser className="inline" />
        {trip.age_at_trip}
      </div>
    </Tooltip>
  );
};

export const showNumberOfRides = (ridesLength: number) => (
  <Tooltip content={`${ridesLength} ${pluralize(ridesLength, 'ride')}`}>
    <div className="flex items-center gap-1">
      <FiThumbsUp className="inline " /> {ridesLength}
    </div>
  </Tooltip>
);

export const showHitchhikedKms = (size: number) => (
  <Tooltip content={`${size} hitchhiked kms`}>
    <div className="flex items-center gap-1">
      <FaArrowRight className="inline " /> {size} km
    </div>
  </Tooltip>
);

export const showNumberOfStories = (rides: Ride[]) => {
  const numberOfStories = rides
    .map((x) => x.story)
    .filter((story) => story != null && story != '').length;
  if (!numberOfStories) return;
  return (
    <Tooltip
      content={`${numberOfStories} ${pluralize(numberOfStories, 'story')}`}
    >
      <FaScroll className="inline" /> {numberOfStories}
    </Tooltip>
  );
};

export const viewAverageSpeed = (speed: string) => {
  if (!speed) return null;
  return (
    <Tooltip content={`Average speed ${speed}`}>
      <div className="flex items-center gap-1">
        <BsSpeedometer className="inline" />
        {speed}
      </div>
    </Tooltip>
  );
};

export const viewAverageWaitingTime = (waitingTime: number) => {
  if (!waitingTime) return null;
  return (
    <Tooltip content={`Average waiting time ${waitingTime}`}>
      <div className="flex items-center gap-1">
        <CgSandClock className="inline" />
        {waitingTime}
      </div>
    </Tooltip>
  );
};

export const viewNumberOfComments = (size: number) => {
  if (!size) return null;
  return (
    <Tooltip content={`${size} ${pluralize(size, 'comment')}`}>
      <div className="flex items-center gap-1">
        <BsChat className="inline" /> {size}
      </div>
    </Tooltip>
  );
};

export const showTripDistance = (distance: number | undefined) => {
  if (!distance) return null;
  const kilometers = (distance / 1000).toFixed(2);
  return (
    <Tooltip content={`travelled ${kilometers} kms`}>
      <div className="flex items-center gap-1">
        <BsArrowRight className="inline" />
        {kilometers} km
      </div>
    </Tooltip>
  );
};

export const showTripGoogleDuration = (google_duration: number | undefined) => {
  if (!google_duration) return null;
  return (
    <Tooltip
      content={`Google Maps duration: ${secondsToTime(google_duration)}`}
    >
      <div className="flex items-center gap-1">
        <FaGoogle className="inline-block" />
        {secondsToTime(google_duration)}
      </div>
    </Tooltip>
  );
};

export const showTripDuration = (
  departure: string | undefined,
  arrival: string | undefined
) => {
  if (!departure || !arrival) return null;
  const duration = calculateTimeBetweenDates(departure, arrival);
  return (
    <Tooltip content={`Trip duration: ${duration}`}>
      <div className="flex items-center gap-1">
        <BsClock className="inline" />
        {duration}
      </div>
    </Tooltip>
  );
};

export const showUserGender = (
  gender: 'male' | 'female' | 'non-binary' | null,
  size = 16
) => {
  if (!gender) return null;

  return (
    <Tooltip content={gender}>
      {gender == 'male' ? (
        <FaMars className="inline" size={size} />
      ) : gender == 'female' ? (
        <FaVenus className="inline" />
      ) : gender == 'non-binary' ? (
        <FaMarsStrokeV className="inline" />
      ) : (
        <></>
      )}
    </Tooltip>
  );
};

export const viewNumberOfTrips = (tripsSize: number) => (
  <Tooltip content={`${tripsSize} ${pluralize(tripsSize, 'trip')}`}>
    <div className="flex items-center gap-1">
      <FaRoad className="inline " /> {tripsSize}
    </div>
  </Tooltip>
);

export const viewNumberOfRides = (ridesSize: number) => (
  <Tooltip content={`${ridesSize} ${pluralize(ridesSize, 'ride')}`}>
    <div className="flex items-center gap-1">
      <FiThumbsUp className="inline " /> {ridesSize}
    </div>
  </Tooltip>
);

export const viewNumberOfStories = (size: number) => (
  <Tooltip content={`${size} ${pluralize(size, 'story')}`}>
    <div className="flex items-center gap-1">
      <FaScroll className="inline " /> {size}
    </div>
  </Tooltip>
);

export const photoForUser = (user: User, size = '96x96') =>
  `https://robohash.org/${user.username}?size=${size}&set=${
    user?.gender === 'male' ? 'set1' : 'set4'
  }`;

export const profilePicture = (md5_email: string, size = 64) =>
  `https://www.gravatar.com/avatar/${md5_email}?s=${size}`;

export const showEmbeddedYoutubeVideo = (youtubeId: string | undefined) => {
  if (!youtubeId) return null;
  return (
    <div className="w-full my-4">
      <iframe
        className="w-full h-64"
        src={`https://www.youtube.com/embed/${youtubeId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export const tagsForRide = (ride: Ride) =>
  ride.tags.map((tag) => (
    <Badge color="purple" key={`${ride.id}${tag}`}>
      {tag}
    </Badge>
  ));

export const tagsForRides = (rides: Ride[]) => {
  const tags = removeDuplicates(rides.map((x) => x.tags).flat());
  return tags.map((tag) => (
    <Badge color="purple" key={tag}>
      {tag}
    </Badge>
  ));
};
