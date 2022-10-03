import { FC } from 'react';
import { Trip } from '../types';
import TripCard from './TripCard';

export const ListTrips: FC<{
  trips: Trip[];
  map: google.maps.Map | null;
}> = ({ map, trips }) => {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="card-grid">
        {trips.map((trip) => (
          <TripCard trip={trip} map={map} key={trip.id} />
        ))}
      </div>
    </div>
  );
};
