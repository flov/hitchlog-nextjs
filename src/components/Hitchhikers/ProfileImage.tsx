import React, { FC } from 'react';

import Image from 'next/image';

import { User } from '@/types';
import { profilePicture } from '@/utils';

export const ProfileImage: FC<{ user: User }> = ({ user }) => {
  return (
    <Image
      className="w-24 h-24 rounded-full"
      width={96}
      height={96}
      src={profilePicture(user.md5_email, 96)}
      alt={`${user?.username}'s profile picture'`}
    />
  );
};
