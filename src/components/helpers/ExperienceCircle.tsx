import React, { FC } from 'react';
import { getOrdinalNumber } from '../../utils';

const ExperienceCircle: FC<{
  experience: string | undefined;
  size?: number;
  numberOfRide?: number;
}> = ({ experience, size = 5, numberOfRide }) => {
  'relative flex items-center justify-center w-5 h-5 text-xs text-white bg-gray-700 font-sm  ';

  return (
    <div
      className={`relative flex items-center justify-center rounded-full  text-xs font-sm h-${size} w-${size} ${
        experience === 'very good'
          ? 'bg-green-600 ring-green-500'
          : experience === 'good'
          ? 'bg-green-500 ring-green-400'
          : experience === 'bad'
          ? 'bg-red-400 ring-red-300'
          : experience === 'very bad'
          ? 'bg-red-600 ring-red-500'
          : 'bg-yellow-300 ring-yellow-200'
      } ${
        numberOfRide ? 'ring-2' : 'border dark:border-gray-600 border-gray-200'
      }
      `}
    ></div>
  );
};

export default ExperienceCircle;
