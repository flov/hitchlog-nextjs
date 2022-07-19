import { Badge, Card, Timeline } from 'flowbite-react';
import moment from 'moment';
import Image from 'next/image';
import { EXPERIENCES, Trip } from '../db/trips';
import { BsArrowRight } from 'react-icons/bs';
import { experienceToColor, timestampToDate } from '../utils';
import { vehicleToIcon } from '../utils/viewHelpers';
import { User } from '../db/users';
import ReactMarkdown from 'react-markdown';
import { Ride } from '../db/trips';

export function HitchhikingTrip({
  user,
  trip,
  rides,
}: {
  user: User;
  trip: Trip;
  rides: Ride[];
}) {
  const createdAt = timestampToDate(trip.createdAt);
  const departure = timestampToDate(trip.departure);
  const arrival = timestampToDate(trip.arrival);
  console.log(trip);

  return (
    <div className="shadow-lg">
      <Card>
        <div className="flex flex-col items-center text-center ">
          <Image
            className="w-24 h-24 "
            width={96}
            height={96}
            src={
              user?.photoURL ||
              `https://robohash.org/${user?.displayName}?size=96x96&set=${
                user.gender === 'male' ? 'set1' : 'set4'
              }`
            }
            alt={`Avatar from ${user?.displayName}`}
          />
          <h5 className="mt-2 mb-1 text-xl font-medium text-gray-900 dark:text-white"></h5>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Hitchhiked by {user?.displayName?.split(' ')[0]}
          </span>
        </div>

        <h5 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Trip from {trip.origin.city} <BsArrowRight className="inline" />{' '}
          {trip.destination.city} hitchhiked {moment(departure).fromNow()}
        </h5>
        <Timeline>
          {rides.map((ride, index) => {
            return (
              <Timeline.Item key={`ride${index}`}>
                <Timeline.Point />
                <Timeline.Content>
                  <Timeline.Time>
                    <div className="flex items-center gap-4">
                      <span>Ride {index + 1} </span>
                      <Badge
                        className="inline"
                        color={experienceToColor(
                          ride.experience as EXPERIENCES
                        )}
                      >
                        {ride.experience}
                      </Badge>
                      {ride.vehicle && vehicleToIcon(ride.vehicle)}
                      {ride.gender && <span>{ride.gender}</span>}
                      {ride.waitingTime ? (
                        <span>waiting time: {ride.waitingTime}m</span>
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
