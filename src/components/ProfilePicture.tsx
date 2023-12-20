import React, { FC } from 'react';

import Image from 'next/image';

import { profilePicture } from '@/utils/viewHelpers';
import { User } from '@/types';

type ProfilePictureProps = {
  user: User;
};

export const ProfilePicture: FC<ProfilePictureProps> = ({ user }) => {
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
