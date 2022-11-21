import Link from 'next/link';
import React, { FC } from 'react';
import { Trip } from '../../types';
import { showAgeAtTrip } from '../../utils/viewHelpers';
import CountryFlags from '../helpers/CountryFlags';
import ExperiencesForRides from '../helpers/ExperiencesForRides';

const TripHeadline: FC<{ trip: Trip }> = ({ trip }) => {
  return (
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
  );
};

export default TripHeadline;
