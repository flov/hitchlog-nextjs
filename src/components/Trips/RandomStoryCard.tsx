import Link from 'next/link';
import React, { FC, Fragment } from 'react';
import { Trip } from '../../types';
import { showAgeAtTrip } from '../../utils/viewHelpers';
import CountryFlags from '../helpers/CountryFlags';
import ExperiencesForRides from '../helpers/ExperiencesForRides';
import HitchhikedBy from '../helpers/HitchhikedBy';
import RideCard from './RideCard';

const RandomStoryCard: FC<{ trip: Trip }> = ({ trip }) => {
  console.log(trip);
  return (
    <Fragment>
      <div className="flex items-center justify-between mb-2">
        <Link key={trip.id} href={`/trips/${trip.to_param}`}>
          From {trip.origin.sanitized_address} to{' '}
          {trip.destination.sanitized_address}
        </Link>

        <div className="flex items-center gap-2">
          <ExperiencesForRides rides={trip.rides} />
          {showAgeAtTrip(trip)}
          <CountryFlags trip={trip} />
        </div>
      </div>
      <div className="mb-4">
        <HitchhikedBy trip={trip} />
      </div>

      {trip.rides.map((ride, index) => (
        <RideCard
          ride={ride}
          trip_param={trip.to_param}
          key={`ridecard${index}`}
        />
      ))}
    </Fragment>
  );
};

export default RandomStoryCard;
