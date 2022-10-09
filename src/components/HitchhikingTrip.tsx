import { Badge, Card, Timeline, Tooltip } from 'flowbite-react';
import moment from 'moment';
import Image from 'next/image';
import { BsArrowRight } from 'react-icons/bs';
import { experienceToColor, getOrdinalNumber, profilePicture } from '../utils';
import {
  showAgeAtTrip,
  showNumberOfRides,
  showNumberOfStories,
  showTotalWaitingTimeForRides,
  viewAverageSpeed,
  showTripGoogleDuration,
  vehicleToIcon,
  showTripDistance,
  showEmbeddedYoutubeVideo,
  countryFlagsForTrip,
  experiencesForRides,
  tagsForRides,
  tagsForRide,
} from '../utils/viewHelpers';
import ReactMarkdown from 'react-markdown';
import { User, EXPERIENCES, Ride, Trip } from '../types';
import { CgSandClock } from 'react-icons/cg';
import Link from 'next/link';

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

  return (
    <Card>
      <div className="flex flex-col items-center text-center ">
        <Image
          className="w-24 h-24 rounded-full"
          width={96}
          height={96}
          src={profilePicture(user.md5_email, 96)}
          alt={`${user?.username}'s profile picture'`}
        />
        <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Hitchhiked {moment(departure).fromNow()} by{' '}
          <Link href={`/hitchhikers/${user.username}`}>
            <a className="font-semibold text-gray-900 dark:text-white">
              {user?.username}
            </a>
          </Link>
        </span>

        <div className="flex flex-col items-center justify-between text-gray-500">
          <div className="flex items-center mt-2 gap-2 dark:text-white">
            {experiencesForRides(rides)}
            {countryFlagsForTrip(trip)}
          </div>
          {trip.rides.length > 0 && (
            <div className="flex items-center mt-3 gap-2 dark:text-white">
              {tagsForRides(trip.rides)}
            </div>
          )}
        </div>

        <div className="flex items-center mt-2 gap-2 dark:text-white">
          {showTotalWaitingTimeForRides(trip.rides)}
          {showAgeAtTrip(trip, user)}
          {showNumberOfRides(trip.rides.length)}
          {showTripGoogleDuration(trip.google_duration)}
        </div>
        <div className="flex items-center mt-2 gap-2 dark:text-white">
          {viewAverageSpeed(trip.average_speed)}
          {showTripDistance(trip.total_distance)}
          {showNumberOfStories(trip.rides)}
        </div>

        {trip.origin.city && trip.destination.city && (
          <h5 className="mt-2 text-2xl font-bold tracking-tight text-center text-gray-900 dark:text-white">
            {trip.origin?.city} <BsArrowRight className="inline" />{' '}
            {trip.destination?.city}
          </h5>
        )}
      </div>
      <div className="p-4">
        <Timeline>
          {rides.map((ride, index) => {
            return (
              <Timeline.Item key={`ride${index}`}>
                <Timeline.Point className="text-white" />
                <Timeline.Content>
                  <Timeline.Time>
                    <div className="flex items-center text-gray-600 dark:text-white gap-2">
                      <span>{`${getOrdinalNumber(index + 1)} ride`} </span>
                      <Badge
                        color={experienceToColor(
                          ride.experience as EXPERIENCES
                        )}
                      >
                        {ride.experience}
                      </Badge>
                      {tagsForRide(ride)}
                      {ride.vehicle && vehicleToIcon(ride.vehicle)}
                      {ride.gender && <span>{ride.gender}</span>}
                      {ride.waiting_time ? (
                        <span>
                          <Tooltip
                            content={`Waiting time: ${ride.waiting_time} minutes`}
                          >
                            <CgSandClock className="inline" />{' '}
                            {ride.waiting_time}m
                          </Tooltip>
                        </span>
                      ) : (
                        ''
                      )}
                    </div>
                  </Timeline.Time>
                  <Timeline.Title className="mt-3">
                    <h1 className="2xl">{ride.title}</h1>
                  </Timeline.Title>
                  <Timeline.Body className="max-w-2xl mt-2">
                    {ride.story && <ReactMarkdown>{ride.story}</ReactMarkdown>}
                    {showEmbeddedYoutubeVideo(ride.youtube)}
                  </Timeline.Body>
                </Timeline.Content>
              </Timeline.Item>
            );
          })}
        </Timeline>
      </div>
    </Card>
  );
}
