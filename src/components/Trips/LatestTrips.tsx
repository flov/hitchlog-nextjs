import React, { FC } from 'react';

import { Trip } from '@/types';
import { FaThumbsUp } from 'react-icons/fa';
import StoryCard from './StoryCard';

export const LatestTrips: FC<{ trips: Trip[] }> = ({ trips }) => {
  return (
    <div>
      <div className="flex items-center mb-2 gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
          <FaThumbsUp />
        </div>
        <h5>Latest Hitchhiking Trips</h5>
      </div>

      <div>
        {trips.map((trip: Trip, index: number) => (
          <StoryCard trip={trip} key={`latestTrip${index}`} />
        ))}
      </div>
    </div>
  );
};
