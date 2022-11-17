import { Badge, Tooltip } from 'flowbite-react';
import Link from 'next/link';
import React, { FC, Fragment, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { putLikeRide } from '../../db/ride';
import { Ride } from '../../types';
import { getOrdinalNumber } from '../../utils';
import { vehicleToIcon } from '../../utils/viewHelpers';
import { useToasts } from '../contexts/ToastContext';
import ExperienceCircle from '../helpers/ExperienceCircle';

const RideCard: FC<{ ride: Ride; trip_param: string }> = ({
  ride,
  trip_param,
}) => {
  const { addToast } = useToasts();
  const [hasLikedTrip, setHasLikedTrip] = useState(false);

  const likeTrip = () => {
    putLikeRide(ride.id)
      .then((res) => {
        addToast('Liked Ride. Thank you ❤️');
        setHasLikedTrip(true);
        window.confetti();
      })
      .catch((err) => {
        console.log(err);
        const errorMessage = err?.response?.data && err.response.data[0];
        errorMessage
          ? addToast(errorMessage, 'error')
          : addToast('Something went wrong', 'error');
      });
  };
  return (
    <Fragment>
      {ride.story && (
        <>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge size="xs" color="purple">
                {getOrdinalNumber(ride.number)}
              </Badge>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                <Link href={`/trips/${trip_param}`}>{ride.title}</Link>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {ride.vehicle && vehicleToIcon(ride.vehicle)}
              <Tooltip
                content={`${getOrdinalNumber(ride.number)} Ride, ${
                  ride.experience
                } Experience`}
              >
                <ExperienceCircle experience={ride.experience} size={4} />
              </Tooltip>
              <div
                onClick={likeTrip}
                className="rounded-full cursor-pointer  dark:text-white"
              >
                <div className="">
                  {hasLikedTrip || ride.already_liked ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart className="hover:text-red-500 hover:animate-fadeIn" />
                  )}
                </div>
              </div>
            </div>
          </div>
          {ride.story && (
            <p className="mt-1 mb-5 font-light text-gray-500 dark:text-gray-400">
              {ride.story}
            </p>
          )}
        </>
      )}
    </Fragment>
  );
};

export default RideCard;
