import { FC, Fragment } from 'react';

import { Trip } from '../../types';
import HitchhikedBy from '../helpers/HitchhikedBy';

import RideCard from './RideCard';
import TripHeadline from './TripHeadline';

const StoryCard: FC<{ trip: Trip }> = ({ trip }) => {
  return (
    <Fragment>
      <TripHeadline trip={trip} />
      <div className="mb-2">
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

export default StoryCard;
