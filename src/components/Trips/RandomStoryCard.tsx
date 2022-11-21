import { FC, Fragment } from 'react';
import { Trip } from '../../types';
import HitchhikedBy from '../helpers/HitchhikedBy';
import RideCard from './RideCard';
import { TagsForRides } from './TagsForRide';
import TripHeadline from './TripHeadline';

const RandomStoryCard: FC<{ trip: Trip }> = ({ trip }) => {
  return (
    <Fragment>
      <TripHeadline trip={trip} />
      <div className="mb-4">
        <HitchhikedBy trip={trip} />
      </div>
      <div className="flex items-center mb-4 overflow-x-auto gap-2 dark:text-white">
        <TagsForRides rides={trip.rides} />
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
