import { Badge, Tooltip } from 'flowbite-react';
import Link from 'next/link';
import React, { FC, Fragment } from 'react';
import { Trip } from '../../types';
import { getOrdinalNumber } from '../../utils';
import { showAgeAtTrip, vehicleToIcon } from '../../utils/viewHelpers';
import CountryFlags from '../helpers/CountryFlags';
import ExperienceCircle from '../helpers/ExperienceCircle';
import ExperiencesForRides from '../helpers/ExperiencesForRides';
import HitchhikedBy from '../helpers/HitchhikedBy';

const RandomStories: FC<{ trips: Trip[] }> = ({ trips }) => {
  return (
    <div>
      {trips.map((trip: Trip, index: number) => (
        <Fragment key={`randomStories${index}`}>
          <div className="flex items-center justify-between mb-2">
            <Link key={trip.id} href={`/trips/${trip.to_param}`}>
              From {trip.origin.sanitized_address} to{' '}
              {trip.destination.sanitized_address}
            </Link>

            <div className="flex items-center gap-2">
              <ExperiencesForRides rides={trip.rides} />
              {showAgeAtTrip(trip)}
              <CountryFlags trip={trip} />
            </div>
          </div>
          <div className="mb-4">
            <HitchhikedBy trip={trip} />
          </div>

          {trip.rides.map((ride, index) => (
            <Fragment key={`ride${index}`}>
              {ride.story && (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge size="xs" color="purple">
                        {getOrdinalNumber(ride.number)}
                      </Badge>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        <Link href={`/trips/${trip.to_param}`}>
                          {ride.title}
                        </Link>
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      {ride.vehicle && vehicleToIcon(ride.vehicle)}
                      <Tooltip
                        content={`${getOrdinalNumber(ride.number)} Ride, ${
                          ride.experience
                        } Experience`}
                      >
                        <ExperienceCircle
                          experience={ride.experience}
                          size={4}
                        />
                      </Tooltip>
                    </div>
                  </div>
                  {ride.story && (
                    <p className="mt-1 mb-5 font-light text-gray-500 dark:text-gray-400">
                      {ride.story}
                    </p>
                  )}
                </>
              )}
            </Fragment>
          ))}
        </Fragment>
      ))}
    </div>
  );
};

export default RandomStories;