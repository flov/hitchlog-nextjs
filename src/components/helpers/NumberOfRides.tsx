import { pluralize } from '@/utils';
import { Tooltip } from 'flowbite-react';
import React, { FC } from 'react';
import { FiThumbsUp } from 'react-icons/fi';

export const NumberOfRides: FC<{ ridesSize: number }> = ({ ridesSize }) => {
  return (
    <Tooltip content={`${ridesSize} ${pluralize(ridesSize, 'ride')}`}>
      <div className="flex items-center gap-1">
        <FiThumbsUp className="inline " /> {ridesSize}
      </div>
    </Tooltip>
  );
};
