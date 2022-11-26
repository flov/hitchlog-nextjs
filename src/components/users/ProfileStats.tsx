import moment from 'moment';
import { FC } from 'react';
import Image from 'next/image';
import { Profile } from '../../types';
import { capitalize, profilePicture } from '../../utils';
import {
  showCountryFlagForUser,
  showHitchhikedKms,
  showUserGender,
  viewAverageSpeed,
  viewAverageWaitingTime,
  viewNumberOfComments,
  viewNumberOfRides,
  viewNumberOfStories,
  viewNumberOfTrips,
} from '../../utils/viewHelpers';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import CountryFlagsForProfile from '../helpers/CountryFlagsForProfile';

const ProfileStats: FC<{ profile: Profile }> = ({ profile }) => {
  const createdAt = moment(profile.created_at).format('MMM YYYY');
  const { currentUser } = useAuth();
  return (
    <>
      <div className="flex justify-center image-shadow">
        <Image
          className="rounded-full shadow shadow-lg"
          alt="Profile picture"
          width={128}
          height={128}
          src={profilePicture(profile.md5_email, 128)}
        />
      </div>
      <div className="flex items-center justify-center mt-4 gap-2">
        {capitalize(profile.username)} {profile.age && `(${profile.age})`}
        {showUserGender(profile.gender, 20)}
        {showCountryFlagForUser(profile)}
      </div>
      <div className="flex items-center justify-center text-gray-400 gap-1">
        <p>Member since:</p>
        {profile.created_at && <p>{createdAt}</p>}
      </div>
      <div className="flex items-center justify-center pt-2 gap-2">
        {viewNumberOfTrips(profile.number_of_trips)}
        {viewNumberOfRides(profile.number_of_rides)}
        {viewNumberOfStories(profile.number_of_stories)}
        {viewNumberOfComments(profile.number_of_comments)}
      </div>
      <div className="flex items-center justify-center pb-2 gap-2">
        {viewAverageSpeed(profile.average_speed)}
        {viewAverageWaitingTime(profile.average_waiting_time)}
        {showHitchhikedKms(profile.hitchhiked_kms)}
      </div>
      <div className="grid grid-auto-fit gap-1">
        <CountryFlagsForProfile
          hitchhiked_countries={profile.hitchhiked_countries}
        />
      </div>
      {profile.trustroots && (
        <div className="mt-2">
          Trustroots:{' '}
          <a
            className="text-primary-500"
            href={
              profile.trustroots.includes('http')
                ? profile.trustroots
                : `https://www.trustroots.org/profile/${profile.trustroots}`
            }
          >
            {profile.trustroots.includes('http')
              ? profile.trustroots.split('/').pop()
              : profile.trustroots}
          </a>
        </div>
      )}

      {currentUser && currentUser.username !== profile.username && (
        <div className="mt-4">
          <Link
            className="text-blue-500 hover:underline"
            passHref
            href={`/hitchhikers/${profile.username}/send_message`}
          >
            Send message
          </Link>
        </div>
      )}
    </>
  );
};

export default ProfileStats;
