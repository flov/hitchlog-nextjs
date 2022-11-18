import Link from 'next/link';
import React, { FC, Fragment } from 'react';
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
  );
};

export default RandomVideos;
