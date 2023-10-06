import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react';

import { Trip } from '../../types';
import { profilePicture } from '../../utils';
import { timeAgoInWords } from '../../utils/timeAgoInWords';
import { showUserGender } from '../../utils/viewHelpers';

const HitchhikedBy: FC<{ trip: Trip }> = ({ trip }) => {
  return (
    <div className="flex items-center justify-between">
      {timeAgoInWords(trip.departure)}
      <div className="flex items-center">
        <span className="flex items-center font-medium gap-1 dark:text-white">
          <Link
            className="no-underline hover:underline"
            href={`/hitchhikers/${trip.user.username}`}
          >
            {trip.user.username}
          </Link>
          {showUserGender(trip.user.gender)}

          <Link
            className="flex items-center space-x-2"
            href={`/hitchhikers/${trip.user.username}`}
          >
            <Image
              className="w-6 h-6 border border-gray-600 rounded-full"
              width={34}
              height={34}
              src={profilePicture(trip.user.md5_email)}
              alt={`${trip.user.username}'s profile picture'`}
            />
          </Link>
        </span>
      </div>
    </div>
  );
};

export default HitchhikedBy;
