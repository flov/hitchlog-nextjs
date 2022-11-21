import React, { FC, Fragment } from 'react';
import { Trip } from '../types';
import Image from 'next/image';
import { timeAgoInWords } from '../utils/timeAgoInWords';
import RightArrow from './svg/RightArrow';
import { Button, Tooltip } from 'flowbite-react';
import { showEmbeddedYoutubeVideo } from '../utils/viewHelpers';
import { getOrdinalNumber, profilePicture } from '../utils';
import Link from 'next/link';
import { useAuth } from './contexts/AuthContext';
import ExperienceCircle from './helpers/ExperienceCircle';
import LikeRide from './helpers/LikeRide';
import CarouselForRides from './Trips/CarouselForRides';
import RandomStoryCard from './Trips/RandomStoryCard';

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

  const ridesWithPhoto = trip.rides.filter(
    (ride) => ride?.photo !== null && ride?.photo !== undefined
  );

  const { currentUser } = useAuth();

  return (
    <article
      onClick={centerMapToTrip}
      className="bg-white border border-gray-200 rounded-lg animate-fadeIn dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700"
    >
      <CarouselForRides rides={ridesWithPhoto} />

      <div className="p-6">
        <RandomStoryCard trip={trip} />

        <div className="flex items-center justify-between mb-2 align gap-2">
          <Link href={`/trips/${trip.to_param}`}>
            From {trip.origin?.city} to {trip.destination?.city}
          </Link>
          {currentUser && currentUser.username === trip.user.username && (
            <Link href={`/trips/${trip.to_param}/edit`} passHref>
              <Button size="xs">Edit</Button>
            </Link>
          )}
        </div>
        {trip.rides.map((ride, index) => (
          <Fragment key={`ride${index}`}>
            {ride.story && (
              <>
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-between w-full">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      <Link href={`/trips/${trip.to_param}`}>
                        {ride.title
                          ? ride.title
                          : `${getOrdinalNumber(ride.number)} ride`}
                      </Link>
                    </h2>
                    <div className="flex items-center gap-2">
                      <Tooltip content={`${ride.experience} Experience`}>
                        <ExperienceCircle
                          experience={ride.experience}
                          size={3}
                        />
                      </Tooltip>
                      <LikeRide ride={ride} />
                    </div>
                  </div>
                </div>
                {ride.story && (
                  <p className="mt-1 mb-5 font-light text-gray-500 dark:text-gray-400">
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
                <Link
                  className="flex items-center space-x-2"
                  href={`/hitchhikers/${trip.user.username}`}
                >
                  <Image
                    className="w-6 h-6 border border-gray-600 rounded-full"
                    width={28}
                    height={28}
                    // @ts-ignore
                    src={profilePicture(trip.user.md5_email)}
                    alt={`${trip.user.username}'s profile picture'`}
                  />
                </Link>

                <span className="font-medium dark:text-white">
                  <Link
                    className="no-underline hover:underline"
                    href={`/hitchhikers/${trip.user.username}`}
                  >
                    {trip.user.username}
                  </Link>
                </span>
              </>
            )}
          </div>
          <Link
            className="inline-flex items-center font-medium no-underline text-primary-600 dark:text-primary-500 hover:underline"
            href={`/trips/${trip.to_param}`}
          >
            <>
              Show Trip
              <RightArrow />
            </>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default TripCard;
