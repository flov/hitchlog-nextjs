import React, { FC } from 'react';
import { Trip } from '../../types';
import { getOrdinalNumber } from '../../utils';
import Link from 'next/link';

const RandomPhotos: FC<{ trips: Trip[] }> = ({ trips }) => {
  return (
    <>
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
    </>
  );
};

export default RandomPhotos;
