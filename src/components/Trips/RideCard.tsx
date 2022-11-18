import { Badge, Tooltip } from 'flowbite-react';
import Link from 'next/link';
import React, { FC, Fragment } from 'react';
import { Ride } from '../../types';
import { getOrdinalNumber } from '../../utils';
import { vehicleToIcon } from '../../utils/viewHelpers';
import ExperienceCircle from '../helpers/ExperienceCircle';
import LikeRide from '../helpers/LikeRide';

const RideCard: FC<{ ride: Ride; trip_param: string }> = ({
  ride,
  trip_param,
}) => {
  return (
    <Fragment>
      {ride.story && (
        <>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge size="xs" color="purple">
                {getOrdinalNumber(ride.number)}
              </Badge>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                <Link href={`/trips/${trip_param}`}>{ride.title}</Link>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {ride.vehicle && vehicleToIcon(ride.vehicle)}
              <Tooltip
                content={`${getOrdinalNumber(ride.number)} Ride, ${
                  ride.experience
                } Experience`}
              >
                <ExperienceCircle experience={ride.experience} size={4} />
              </Tooltip>
              <LikeRide ride={ride} />
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
  );
};

export default RideCard;
