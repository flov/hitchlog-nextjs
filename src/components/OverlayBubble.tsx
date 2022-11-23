import React, { FC, useState } from 'react';
import { BsArrowRight } from 'react-icons/bs';
import { IoIosClose } from 'react-icons/io';
import { Trip } from '../types';
import StoryCard from './Trips/StoryCard';

const OverlayBubble: FC<{ trip: Trip; map: google.maps.Map }> = ({
  trip,
  map,
}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();

  const setRoute = () => {
    const directionsService = new google.maps.DirectionsService();
    const dr = new google.maps.DirectionsRenderer();
    dr.setMap(map);
    setDirectionsRenderer(dr);
    const origin = new google.maps.LatLng(trip.origin.lat, trip.origin.lng);
    const destination = new google.maps.LatLng(
      trip.destination.lat,
      trip.destination.lng
    );
    directionsService.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          dr.setDirections(result);
        }
      }
    );
  };

  const unsetRoute = () => {
    directionsRenderer?.setMap(null);
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
        <div className="relative max-w-lg p-3 text-lg text-gray-900 bg-white rounded-lg -top-16 -left-12">
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
