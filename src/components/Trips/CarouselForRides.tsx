import { Carousel } from 'flowbite-react';
import React, { FC } from 'react';

import { Ride } from '../../types';
import { getOrdinalNumber } from '../../utils';

const CarouselForRides: FC<{ rides: Ride[] }> = ({ rides }) => {
  return (
    <>
      {rides.length > 1 ? (
        <div className="h-56 sm:h-64 xl:h-76">
          <Carousel slideInterval={5000} slide={true}>
            {rides.map(
              (ride, index) =>
                ride.photo && (
                  <div key={`carousel${ride.id}`} className="relative">
                    <img
                      className="rounded-t-lg"
                      alt={`photo of ${getOrdinalNumber(ride.number)} ride`}
                      key={index}
                      src={ride.photo.url}
                    />
                    <p className="absolute top-0 w-full font-bold text-center bg-white dark:bg-gray-800 opacity-70">
                      {ride.photo_caption}
                    </p>
                  </div>
                )
            )}
          </Carousel>
        </div>
      ) : (
        rides.length === 1 && (
          <div className="relative">
            <img
              className="rounded-t-lg"
              alt={`photo of ${getOrdinalNumber(1)} ride`}
              src={rides[0].photo?.url}
            />
            <p className="flex justify-center">{rides[0].photo_caption}</p>
          </div>
        )
      )}
    </>
  );
};

export default CarouselForRides;
