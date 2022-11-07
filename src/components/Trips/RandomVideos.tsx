import Link from 'next/link';
import React, { FC, Fragment } from 'react';
import { Trip } from '../../types';
import { timeAgoInWords } from '../../utils/timeAgoInWords';
import {
  countryFlagsForTrip,
  showEmbeddedYoutubeVideo,
  vehicleIconsForRides,
} from '../../utils/viewHelpers';
import ExperiencesForRides from '../helpers/ExperiencesForRides';
import HitchhikedBy from '../helpers/HitchhikedBy';

const RandomVideos: FC<{ trips: Trip[] }> = ({ trips }) => {
  const ridesWithVideo = trips
    .map((t) => t.rides)
    .flat()
    .filter((ride) => ride.youtube !== null && ride.youtube !== undefined);

  return (
    <div>
      {trips.map((trip: Trip, index: number) => (
        <Fragment key={`randomVids${index}`}>
          <div className="flex items-center justify-between">
            <Link key={trip.id} href={`/trips/${trip.to_param}`}>
              From {trip.origin.sanitized_address} to{' '}
              {trip.destination.sanitized_address}
            </Link>
            <div className="flex items-center gap-2">
              <ExperiencesForRides rides={trip.rides} />
              {countryFlagsForTrip(trip)}
              {vehicleIconsForRides(trip.rides)}
            </div>
          </div>
          {showEmbeddedYoutubeVideo(ridesWithVideo[0].youtube)}
          <HitchhikedBy trip={trip} />
        </Fragment>
      ))}
    </div>
  );
};

export default RandomVideos;
