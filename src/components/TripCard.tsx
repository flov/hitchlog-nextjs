import React, { FC } from 'react';
import { Trip } from '../types';
import RightArrow from './svg/RightArrow';
import Link from 'next/link';
import CarouselForRides from './Trips/CarouselForRides';
import StoryCard from './Trips/StoryCard';

const TripCard: FC<{ map?: google.maps.Map | null; trip: Trip }> = ({
  map,
  trip,
}) => {
  const centerMapToTrip = () => {
    if (map && trip.center) {
      const center = trip.center.split(',');
      map.panTo({ lat: Number(center[0]), lng: Number(center[1]) });
      map.setZoom(6);
    }
  };

  const ridesWithPhoto = trip.rides.filter(
    (ride) => ride?.photo !== null && ride?.photo !== undefined
  );

  return (
    <article
      onClick={centerMapToTrip}
      className="bg-white border border-gray-200 rounded-lg animate-fadeIn dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700"
    >
      <CarouselForRides rides={ridesWithPhoto} />

      <div className="p-6">
        <StoryCard trip={trip} />
        <div className="flex items-center justify-between">
          <div></div>
          <Link
            className="inline-flex items-center font-medium no-underline text-primary-600 dark:text-primary-500 hover:underline"
            href={`/trips/${trip.to_param}`}
          >
            <>
              Show Trip
              <RightArrow />
            </>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default TripCard;
