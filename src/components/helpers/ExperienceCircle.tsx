import React, { FC } from 'react';

const ExperienceCircle: FC<{
  experience: string | undefined;
  size?: number;
}> = ({ experience, size = 5 }) => {
  return (
    <div
      className={`rounded-full dark:border-gray-600 border-gray-200 border h-${size} w-${size} ${
        experience === 'very good'
          ? 'bg-green-400'
          : experience === 'good'
          ? 'bg-green-500'
          : experience === 'bad'
          ? 'bg-red-400'
          : experience === 'very bad'
          ? 'bg-red-600'
          : 'bg-yellow-300'
      }`}
    ></div>
  );
};

export default ExperienceCircle;
