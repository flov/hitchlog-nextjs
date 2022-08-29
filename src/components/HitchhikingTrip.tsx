import { Badge, Card, Timeline, Tooltip } from 'flowbite-react';
import moment from 'moment';
import Image from 'next/image';
import { BsArrowRight } from 'react-icons/bs';
import { experienceToColor, timestampToDate } from '../utils';
import { vehicleToIcon } from '../utils/viewHelpers';
import ReactMarkdown from 'react-markdown';
import { User, EXPERIENCES, Ride, Timestamp, Trip } from '../types';
import { CgSandClock } from 'react-icons/cg';

export function HitchhikingTrip({
  user,
  trip,
  rides,
}: {
  user: User;
  trip: Trip;
  rides: Ride[];
}) {
  const createdAt = timestampToDate(trip.createdAt as Timestamp);
  const departure = timestampToDate(trip.departure as Timestamp);
  const arrival = timestampToDate(trip.arrival as Timestamp);

  return (
    <div className="shadow-lg">
      <Card>
        <div className="flex flex-col items-center text-center ">
          <Image
            className="w-24 h-24 rounded-full"
            width={96}
            height={96}
            src={
              user?.photoURL ||
              `https://robohash.org/${user?.displayName}?size=96x96&set=${
                user.gender === 'male' ? 'set1' : 'set4'
              }`
            }
            alt={`${user?.displayName}'s profile picture'`}
          />
          <h5 className="mt-2 mb-1 text-xl font-medium text-gray-900 dark:text-white"></h5>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Hitchhiked by {user?.displayName?.split(' ')[0]}
          </span>
        </div>

        <h5 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {trip.origin?.city} <BsArrowRight className="inline" />{' '}
          {trip.destination?.city} hitchhiked {moment(departure).fromNow()}
        </h5>
        <Timeline>
          {rides.map((ride, index) => {
            return (
              <Timeline.Item key={`ride${index}`}>
                <Timeline.Point />
                <Timeline.Content>
                  <Timeline.Time>
                    <div className="flex items-center text-gray-600 gap-4">
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
                      {ride.waitingTime ? (
                        <span>
                          <Tooltip
                            content={`Waiting time: ${ride.waitingTime} minutes`}
                          >
                            <CgSandClock className="inline" />{' '}
                            {ride.waitingTime}m
                          </Tooltip>
                        </span>
                      ) : (
                        ''
                      )}
                    </div>
                  </Timeline.Time>
                  <Timeline.Title className="mt-2">{ride.title}</Timeline.Title>
                  <Timeline.Body className="max-w-2xl mt-2">
                    {ride.story && <ReactMarkdown>{ride.story}</ReactMarkdown>}
                  </Timeline.Body>
                </Timeline.Content>
              </Timeline.Item>
            );
          })}
        </Timeline>
      </Card>
    </div>
  );
}
