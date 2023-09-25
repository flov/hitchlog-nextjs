import React, { FC } from 'react';
import { Trip } from '../../types';
import { getOrdinalNumber } from '../../utils';
import Link from 'next/link';
import { FaPhotoVideo } from 'react-icons/fa';

const RandomPhotos: FC<{ trips: Trip[] }> = ({ trips }) => {
  return (
    <div>
      <div className="flex items-center mb-4 gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
          <FaPhotoVideo />
        </div>
        <h3 className="text-xl font-bold dark:text-white">
          Random Pictures from the road
        </h3>
      </div>

      <div className="mb-4">
        <div className="thumb-grid">
          {trips.map((trip: Trip, index: number) => {
            const ridesWithPhoto = trip.rides
              .flat()
              .filter(
                (ride) => ride.photo !== null && ride.photo !== undefined
              );

            return ridesWithPhoto.map((ride) => (
              <div key={ride.id}>
                <Link href={`/trips/${trip.to_param}`}>
                  <img
                    alt={`photo of ${getOrdinalNumber(ride.number)} ride`}
                    className="rounded-lg"
                    key={index}
                    src={ride.photo?.thumb.url}
                  />
                </Link>
              </div>
            ));
          })}
        </div>
      </div>
    </div>
  );
};

export default RandomPhotos;
