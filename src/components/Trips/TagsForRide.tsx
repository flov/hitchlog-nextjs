import { Badge } from 'flowbite-react';
import React, { FC } from 'react';
import { Ride } from '../../types';
import { removeDuplicates } from '../../utils';

const TagsForRide: FC<{ ride: Ride }> = ({ ride }) => (
  <>
    {ride.tags.map((tag) => (
      <Badge color="purple" key={`${ride.id}${tag}`}>
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
        <Badge color="purple" key={tag}>
          {tag}
        </Badge>
      ))}
    </>
  );
};

export default TagsForRide;
