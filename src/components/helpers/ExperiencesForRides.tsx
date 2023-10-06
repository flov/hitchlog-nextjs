import { Tooltip } from 'flowbite-react';
import React, { FC } from 'react';

import { Ride } from '../../types';
import { pluralize, removeDuplicates } from '../../utils';

import ExperienceCircle from './ExperienceCircle';

const ExperiencesForRides: FC<{ rides: Ride[] }> = ({ rides }) => {
  const experiences = removeDuplicates(rides.map((x) => x.experience)).join(
    ', '
  );
  return (
    <>
      {!!rides?.length && (
        <Tooltip
          content={`${rides.length} ${pluralize(
            rides.length,
            'ride'
          )}: ${experiences}`}
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
                    <ExperienceCircle experience={ride.experience} />
                  </div>
                </div>
              );
            })}
            {rides.length > 5 && (
              <div className="relative flex items-center justify-center w-5 h-5 text-xs text-gray-200 bg-gray-700 rounded-full font-sm ring-2 ring-gray-300 hover:bg-gray-600 dark:ring-gray-500 ">
                {rides.length}
              </div>
            )}
          </div>
        </Tooltip>
      )}
    </>
  );
};

export default ExperiencesForRides;
