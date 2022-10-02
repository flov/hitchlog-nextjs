import Link from 'next/link';
import React, { FC, useState } from 'react';
import { BsArrowRight } from 'react-icons/bs';
import { Trip } from '../types';

const OverlayBubble: FC<{ trip: Trip }> = ({ trip }) => {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <>
      <div className={`popup-bubble ${isOpened ? 'opened' : ''}`}>
        {trip.origin && trip.destination ? (
          <Link
            href={`/trips/${trip.id}`}
            className="font-medium text-blue-600 hover:underline dark:text-blue-500"
          >
            <a className="no-underline">
              {trip.origin.city} <BsArrowRight className="inline" />{' '}
              {trip.destination.city}
            </a>
          </Link>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default OverlayBubble;