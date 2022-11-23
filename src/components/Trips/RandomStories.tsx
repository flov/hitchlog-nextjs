import React, { FC } from 'react';
import { Trip } from '../../types';
import StoryCard from './StoryCard';

const RandomStories: FC<{ trips: Trip[] }> = ({ trips }) => {
  return (
    <div>
      {trips.map((trip: Trip, index: number) => (
        <StoryCard trip={trip} key={`randomStory${index}`} />
      ))}
    </div>
  );
};

export default RandomStories;
