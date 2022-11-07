import Link from 'next/link';
import React, { FC } from 'react';
import { Trip } from '../../types';
import { timeAgoInWords } from '../../utils/timeAgoInWords';
import Image from 'next/image';
import { profilePicture } from '../../utils';

const HitchhikedBy: FC<{ trip: Trip }> = ({ trip }) => {
  return (
    <p className="flex items-center justify-between">
      Hitchhiked {timeAgoInWords(trip.departure)} by
      <div className="flex items-center">
        <Link
          className="flex items-center space-x-2"
          href={`/hitchhikers/${trip.user.username}`}
        >
          <span className="font-medium dark:text-white">
            <Link
              className="no-underline hover:underline"
              href={`/hitchhikers/${trip.user.username}`}
            >
              {trip.user.username}
            </Link>
          </span>

          <Image
            className="w-6 h-6 border border-gray-600 rounded-full"
            width={34}
            height={34}
            // @ts-ignore
            src={profilePicture(trip.user.md5_email)}
            alt={`${trip.user.username}'s profile picture'`}
          />
        </Link>
      </div>
    </p>
  );
};

export default HitchhikedBy;
