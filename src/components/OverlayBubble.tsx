import React, { FC, useRef, useState } from 'react';
import { BsArrowRight } from 'react-icons/bs';
import { IoIosClose } from 'react-icons/io';

import { Trip } from '../types';
import { displayOSRMRoute } from '../utils/OSRMRouteService';

import StoryCard from './Trips/StoryCard';

const OverlayBubble: FC<{ trip: Trip; map: google.maps.Map }> = ({
  trip,
  map,
}) => {
  const [isOpened, setIsOpened] = useState(false);
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  const setRoute = () => {
    if (!trip.origin?.lat || !trip.destination?.lat) return;
    displayOSRMRoute(map, trip.origin, trip.destination, (_, polyline) => {
      polylineRef.current = polyline;
    });
    setIsOpened(true);
  };

  const unsetRoute = () => {
    polylineRef.current?.setMap(null);
    polylineRef.current = null;
    setIsOpened(false);
  };

  const handleBubbleClick = () => {
    if (!isOpened) {
      setRoute();
      setIsOpened(true);
    } else {
      unsetRoute();
      setIsOpened(false);
    }
  };

  return (
    <>
      {isOpened ? (
        <div className="relative max-w-lg p-3 text-black bg-white rounded-lg w-78">
          <button
            className="absolute top-0 right-0"
            onClick={handleBubbleClick}
          >
            <IoIosClose />
          </button>

          <StoryCard trip={trip} />
        </div>
      ) : (
        <div
          className={`popup-bubble p-1 rounded-lg bg-white text-gray-900 ${
            isOpened ? 'opened' : ''
          }`}
        >
          {trip.origin && trip.destination ? (
            <button onClick={handleBubbleClick}>
              {trip.origin.city} <BsArrowRight className="inline" />{' '}
              {trip.destination.city}
            </button>
          ) : (
            <></>
          )}
        </div>
      )}
    </>
  );
};

export default OverlayBubble;
