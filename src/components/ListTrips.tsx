import { FC } from 'react';
import { Trip } from '../types';
import Skeleton from './Skeleton';
import TripCard from './TripCard';

export const ListTrips: FC<{
  trips: Trip[];
  map: google.maps.Map | null;
  isLoading: boolean;
}> = ({ map, trips, isLoading }) => {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="card-grid gap-2 sm:px-4 sm:gap-4">
        {isLoading ? (
          new Array(12).fill(0).map((_, index) => <Skeleton key={index} />)
        ) : trips.length === 0 ? (
          <h1 className="my-4 text-2xl text-center">No trips found</h1>
        ) : (
          trips.map((trip) => <TripCard trip={trip} map={map} key={trip.id} />)
        )}
      </div>
    </div>
  );
};
