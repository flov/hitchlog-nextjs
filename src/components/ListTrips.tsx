import { FC } from 'react';
import { Trip } from '../types';
import BlogCard from './BlogCard';

export const ListTrips: FC<{ trips: Trip[] }> = ({ trips }) => {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="card-grid">
        {trips.map((trip) => (
          <BlogCard trip={trip} key={trip.id} />
        ))}
      </div>
    </div>
  );
};
