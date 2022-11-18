import React, { FC, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { putLikeRide } from '../../db/ride';
import { Ride } from '../../types';
import { useLoginModal } from '../contexts/LoginModal';
import { useToasts } from '../contexts/ToastContext';
import { useAuth } from '../../components/contexts/AuthContext';

const LikeRide: FC<{ ride: Ride }> = ({ ride }) => {
  const { addToast } = useToasts();
  const [hasLikedRide, setHasLikedRide] = useState(false);
  const { toggleLoginModal } = useLoginModal();
  const { isAuthenticated } = useAuth();

  const likeTrip = () => {
    if (!isAuthenticated) {
      toggleLoginModal();
    } else {
      putLikeRide(ride.id)
        .then((res) => {
          addToast('Liked Ride. Thank you ❤️');
          setHasLikedRide(true);
          window.confetti();
        })
        .catch((err) => {
          console.log(err);
          const errorMessage = err?.response?.data && err.response.data[0];
          errorMessage
            ? addToast(errorMessage, 'error')
            : addToast('Something went wrong', 'error');
        });
    }
  };

  return (
    <div
      onClick={likeTrip}
      className="rounded-full cursor-pointer dark:text-white"
    >
      <span className="sr-only">Like Ride</span>
      <div className="">
        {hasLikedRide || ride.already_liked ? (
          <FaHeart className="text-red-500" />
        ) : (
          <FaRegHeart className="text-red-500 hover:animate-ping" />
        )}
      </div>
    </div>
  );
};

export default LikeRide;
