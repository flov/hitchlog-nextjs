import { EXPERIENCES, Trip } from '../db/trips';
import { FaCarSide } from 'react-icons/fa';
import { BsTypeH1 } from 'react-icons/bs';
import { Timestamp } from 'firebase/firestore';

export const experienceToColor = (experience: EXPERIENCES) => {
  switch (experience) {
    case 'good':
      return 'success';
    case 'very good':
      return 'success';
    case 'neutral':
      return 'warning';
    case 'bad':
      return 'failure';
    case 'very bad':
      return 'failure';
    default:
      return 'success';
  }
};

export const tripToString = (trip: Trip) =>
  `Trip from {trip.origin.city} <BsArrowRight className="inline" />{' '} {trip.destination.city}`;

export const timestampToDate = ({
  seconds,
  nanoseconds,
}: {
  seconds: number;
  nanoseconds: number;
}) => new Timestamp(seconds, nanoseconds).toDate();