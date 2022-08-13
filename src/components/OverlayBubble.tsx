import React, { FC, useState } from 'react';
import { BsArrowRight } from 'react-icons/bs';
import { Trip } from '../types';

const OverlayBubble: FC<{ trip: Trip }> = ({ trip }) => {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <>
      <div className={`popup-bubble ${isOpened ? 'opened' : ''}`}>
        {trip.origin && trip.destination ? (
          <button onClick={() => setIsOpened(!isOpened)}>
            {trip.origin.city} <BsArrowRight className="inline" />{' '}
            {trip.destination.city}
          </button>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default OverlayBubble;
