import { Badge } from 'flowbite-react';
import React, { FC } from 'react';
import { Ride } from '../../types';
import { removeDuplicates } from '../../utils';

export const TagsForRide: FC<{ ride: Ride }> = ({ ride }) => (
  <>
    {ride.tags.map((tag) => (
      <Badge color="info" key={`${ride.id}${tag}`}>
        {tag}
      </Badge>
    ))}
  </>
);

export const TagsForRides: FC<{ rides: Ride[] }> = ({ rides }) => {
  const tags = removeDuplicates(rides.map((x) => x.tags).flat());
  return (
    <>
      {tags.map((tag) => (
        <Badge color="info" key={tag}>
          {tag}
        </Badge>
      ))}
    </>
  );
};

export default TagsForRide;
