import { FC } from 'react';
import { Trip } from '../types';
import TripCard from './TripCard';

export const ListTrips: FC<{
  trips: Trip[];
  map: google.maps.Map | null;
}> = ({ map, trips }) => {
  return (
    <div className="mx-auto max-w-7xl">
      {!!trips.length ? (
        <div className="card-grid">
          {trips.map((trip) => (
            <TripCard trip={trip} map={map} key={trip.id} />
          ))}
        </div>
      ) : (
        <h1 className="my-4 text-2xl text-center">No trips found</h1>
      )}
    </div>
  );
};
