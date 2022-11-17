import React, { FC, Fragment } from 'react';
import { Trip } from '../../types';
import RandomStoryCard from './RandomStoryCard';

const RandomStories: FC<{ trips: Trip[] }> = ({ trips }) => {
  return (
    <div>
      {trips.map((trip: Trip, index: number) => (
        <RandomStoryCard trip={trip} key={`randomStory${index}`} />
      ))}
    </div>
  );
};

export default RandomStories;
