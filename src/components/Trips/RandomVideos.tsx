import {timeAgoInWords} from '@/utils/timeAgoInWords';
import Link from 'next/link';
import React, { FC, Fragment } from 'react';
import {FaVideo} from 'react-icons/fa';
import { Trip } from '../../types';
import {
  showEmbeddedYoutubeVideo,
  vehicleIconsForRides,
} from '../../utils/viewHelpers';
import CountryFlags from '../helpers/CountryFlags';
import ExperiencesForRides from '../helpers/ExperiencesForRides';
import HitchhikedBy from '../helpers/HitchhikedBy';
import LikeRide from '../helpers/LikeRide';

const RandomVideos: FC<{ trips: Trip[] }> = ({ trips }) => {
  const ridesWithVideo = trips
    .map((t) => t.rides)
    .flat()
    .filter((ride) => ride.youtube !== null && ride.youtube !== undefined);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
            <FaVideo />
          </div>
          <h5>Random Video</h5>
        </div>
        <p className="text-sm">
          {timeAgoInWords(trips[0]?.departure)}
        </p>
      </div>
      <div className="mb-8">
        {trips.map((trip: Trip, index: number) => (
          <Fragment key={`randomVids${index}`}>
            <div className="flex items-center justify-between">
              <Link key={trip.id} href={`/trips/${trip.to_param}`}>
                From {trip.origin.sanitized_address} to{' '}
                {trip.destination.sanitized_address}
              </Link>
              <div className="flex items-center gap-2">
                <ExperiencesForRides rides={trip.rides} />
                <CountryFlags trip={trip} />
                <LikeRide ride={ridesWithVideo[0]} />
                {vehicleIconsForRides(trip.rides)}
              </div>
            </div>
            {showEmbeddedYoutubeVideo(ridesWithVideo[0].youtube)}
            <HitchhikedBy trip={trip} />
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default RandomVideos;
