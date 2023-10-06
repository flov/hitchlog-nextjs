import React, { FC } from 'react';
import { FaScroll } from 'react-icons/fa';

import { Trip } from '../../types';

import StoryCard from './StoryCard';

const RandomStories: FC<{ trips: Trip[] }> = ({ trips }) => {
  return (
    <div>
      <div className="flex items-center mb-2 gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
          <FaScroll />
        </div>
        <h5>Random Hitchhiking Story</h5>
      </div>

      <div>
        {trips.map((trip: Trip, index: number) => (
          <StoryCard trip={trip} key={`randomStory${index}`} />
        ))}
      </div>
    </div>
  );
};

export default RandomStories;
