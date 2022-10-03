import { Badge, Button, Card, Timeline, Tooltip } from 'flowbite-react';
import moment from 'moment';
import Image from 'next/image';
import { BsArrowRight } from 'react-icons/bs';
import { experienceToColor, removeDuplicates } from '../utils';
import {
  showAgeAtTrip,
  showNumberOfRides,
  showNumberOfStories,
  showTotalWaitingTimeForRides,
  showTripSpeed,
  showTripGoogleDuration,
  showVehiclesForRides,
  vehicleToIcon,
  showTripDistance,
  showEmbeddedYoutubeVideo,
} from '../utils/viewHelpers';
import ReactMarkdown from 'react-markdown';
import { User, EXPERIENCES, Ride, Trip } from '../types';
import { CgSandClock } from 'react-icons/cg';
import { useAuth } from './contexts/AuthContext';
import { useRouter } from 'next/router';
import { FaThumbsUp } from 'react-icons/fa';
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
  const { currentUser } = useAuth();
  const router = useRouter();

  return (
    <div className="shadow-lg">
      <Card>
        <div className="flex flex-col items-center text-center ">
          <Image
            className="w-24 h-24 rounded-full"
            width={96}
            height={96}
            src={`https://robohash.org/${user?.username}?size=96x96&set=${
              user.gender === 'male' ? 'set1' : 'set4'
            }`}
            alt={`${user?.username}'s profile picture'`}
          />
          <h5 className="mt-2 mb-1 text-xl font-medium text-gray-900 dark:text-white"></h5>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Hitchhiked {moment(departure).fromNow()} by{' '}
            <Link href={`/hitchhikers/${user.username}`}>
              <a className="font-semibold text-gray-900 dark:text-white">
                {user?.username}
              </a>
            </Link>
          </span>
          <div className="flex items-center mt-4 gap-2 dark:text-white">
            {showVehiclesForRides(trip.rides)}
            {showTotalWaitingTimeForRides(trip.rides)}
            {showAgeAtTrip(trip, user)}
            {showNumberOfRides(trip.rides.length)}
            {showTripGoogleDuration(trip)}
            {showTripSpeed(trip)}
            {showTripDistance(trip)}
            {showNumberOfStories(trip.rides)}
          </div>
        </div>

        <div className="flex items-center justify-center ">
          <h5 className="text-2xl font-bold tracking-tight text-center text-gray-900 dark:text-white">
            {trip.origin?.city} <BsArrowRight className="inline" />{' '}
            {trip.destination?.city}
          </h5>
          {currentUser && currentUser.username === user.username && (
            <div className="ml-4">
              <Button
                size="sm"
                onClick={() => router.push(`/trips/${trip.id}/edit`)}
                color="light"
              >
                Edit
              </Button>
            </div>
          )}
        </div>
        <div className="p-4">
          <Timeline>
            {rides.map((ride, index) => {
              return (
                <Timeline.Item key={`ride${index}`}>
                  <Timeline.Point icon={FaThumbsUp} className="text-white" />
                  <Timeline.Content>
                    <Timeline.Time>
                      <div className="flex items-center text-gray-600 dark:text-white gap-4">
                        <span>Ride {index + 1} </span>
                        <Badge
                          color={experienceToColor(
                            ride.experience as EXPERIENCES
                          )}
                        >
                          {ride.experience}
                        </Badge>
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
                    <Timeline.Title className="mt-2">
                      {ride.title}
                    </Timeline.Title>
                    <Timeline.Body className="max-w-2xl mt-2">
                      {ride.story && (
                        <ReactMarkdown>{ride.story}</ReactMarkdown>
                      )}
                      {showEmbeddedYoutubeVideo(ride.youtube)}
                    </Timeline.Body>
                  </Timeline.Content>
                </Timeline.Item>
              );
            })}
          </Timeline>
        </div>
      </Card>
    </div>
  );
}
