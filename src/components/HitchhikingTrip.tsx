import { Button, Card, Carousel, Tooltip } from 'flowbite-react';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';

import { createTripComment } from '../db/comments';
import { Ride, Trip, User } from '../types';
import { capitalize, getOrdinalNumber, profilePicture } from '../utils';
import {
  showAgeAtTrip,
  showEmbeddedYoutubeVideo,
  showNumberOfStories,
  showTotalWaitingTimeForRides,
  showTripDistance,
  showTripGoogleDuration,
  showUserGender,
  vehicleIconsForRides,
  viewAverageSpeed,
} from '../utils/viewHelpers';

import CommentSection from './Blog/CommentSection';
import { TagsForRide, TagsForRides } from './Trips/TagsForRide';
import { useAuth } from './contexts/AuthContext';
import CountryFlags from './helpers/CountryFlags';
import ExperienceCircle from './helpers/ExperienceCircle';
import ExperiencesForRides from './helpers/ExperiencesForRides';
import LikeRide from './helpers/LikeRide';

export function HitchhikingTrip({
  user,
  trip,
  rides,
}: {
  rides: Ride[];
  user: User;
  trip: Trip;
}) {
  const departure = trip.departure;
  const { currentUser } = useAuth();
  const ridesWithPhoto = rides.filter(
    (ride) => ride?.photo !== null && ride?.photo !== undefined
  );

  return (
    <Card>
      <div className="relative flex flex-col items-center text-center">
        {currentUser && currentUser.username === trip.user.username && (
          <div className="absolute top-0 right-0 flex items-center justify-between mb-2 align gap-2">
            <Link href={`/trips/${trip.to_param}/edit`} passHref>
              <Button size="xs">Edit</Button>
            </Link>
          </div>
        )}

        <Image
          className="w-24 h-24 rounded-full"
          width={96}
          height={96}
          src={profilePicture(user.md5_email, 96)}
          alt={`${user?.username}'s profile picture'`}
        />
        <span className="flex items-center mt-2 text-sm text-gray-500 gap-1 dark:text-gray-400">
          <Link
            className="font-semibold text-gray-900 dark:text-white"
            href={`/hitchhikers/${user.username}`}
          >
            {capitalize(user?.username)}
          </Link>
          {showUserGender(user.gender)}
        </span>
        <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          Hitchhiked {moment(departure).fromNow()}
        </span>

        <div className="flex flex-col items-center justify-between text-gray-500">
          <div className="flex items-center mt-2 gap-2 dark:text-white">
            <ExperiencesForRides rides={rides} />
            <CountryFlags trip={trip} />
          </div>
          {rides.length > 0 && (
            <div className="flex items-center mt-3 mb-2 gap-2 dark:text-white">
              <TagsForRides rides={rides} />
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center gap-2">
          <div className="flex items-center justify-center gap-2 dark:text-white">
            {trip.total_distance && showTripDistance(trip.total_distance)}
            {trip.google_duration &&
              showTripGoogleDuration(trip.google_duration)}
            {!!trip.average_speed && viewAverageSpeed(trip.average_speed)}
            {showAgeAtTrip(trip)}
          </div>
          <div className="flex items-center justify-center gap-2 dark:text-white">
            {vehicleIconsForRides(rides)}
            {showTotalWaitingTimeForRides(rides)}
            {showNumberOfStories(rides)}
          </div>
        </div>

        <h5 className="mt-2 text-xl tracking-tight text-center text-gray-900 dark:text-white">
          From {trip.origin?.sanitized_address} to{' '}
          {trip.destination?.sanitized_address}
        </h5>
      </div>
      <article>
        <div
          className={`h-56 sm:h-64 xl:h-76 pb-4 ${
            ridesWithPhoto.length === 0 && 'hidden'
          }`}
        >
          <Carousel slideInterval={5000} slide={true}>
            {ridesWithPhoto.map(
              (ride, index) =>
                ride.photo && (
                  <div key={`photo${ride.id}`} className="relative">
                    <img
                      alt={`photo of ${getOrdinalNumber(ride.number)} ride`}
                      key={index}
                      src={ride.photo.url}
                    />
                    <p className="absolute top-0 w-full font-bold text-center bg-white dark:bg-gray-800 opacity-70">
                      {ride.photo_caption}
                    </p>
                  </div>
                )
            )}
          </Carousel>
        </div>

        {rides.map((ride, index) => (
          <Fragment key={`ride${index}`}>
            {ride.story && (
              <>
                <div className="flex items-center gap-2">
                  <LikeRide ride={ride} />
                  <Tooltip content={`${ride.experience} Experience`}>
                    <ExperienceCircle experience={ride.experience} size={3} />
                  </Tooltip>
                  <div className="flex items-center gap-2">
                    <TagsForRide ride={ride} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    <Link href={`/trips/${trip.to_param}`}>
                      {ride.title
                        ? ride.title
                        : `${getOrdinalNumber(ride.number)} ride`}
                    </Link>
                  </h2>
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
            <>Read more</>
          </Link>
        </div>

        <div className="mt-8">
          <CommentSection
            submitCallback={createTripComment}
            comments={trip.comments}
            id={trip.id as number}
          />
        </div>
      </article>
    </Card>
  );
}
