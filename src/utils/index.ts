import { EXPERIENCES, Trip, IpLocation, User } from '../types';
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

export const fetchIpAddressOfClient = async () => {
  const response = await fetch('https://api.ipify.org?format=json');
  const json = await response.json();
  return json.ip;
};

export const fetchLocationFromClient = async () => {
  const ipAddress = await fetchIpAddressOfClient();
  const response = await fetch(
    `https://api.ipgeolocation.io/ipgeo?apiKey=632c15294cec4b7480bbebad1136a9a9&ip=${ipAddress}`
  );
  const data = await response.json();
  return data as IpLocation;
};

export const myXOR = (a: any, b: any): boolean => {
  return (a || b) && !(a && b);
};

export const removeDuplicates = (arr: any[]) => {
  return arr.filter((item, index) => arr.indexOf(item) === index);
};

export const pluralize = (count: number, word: string) => {
  return count === 1 ? word : word + 's';
};

// https://maps.googleapis.com/maps/api/staticmap?size=300x200&maptype=roadmap&markers=color:red|label:A|${trip.origin?.lat},${trip.origin?.lng}&markers=color:red|label:B|${trip.destination?.lat},${trip.destination?.lng}&path=color:0xff0000|weight:5|${trip.origin?.lat},${trip.origin?.lng}|${trip.destination?.lat},${trip.destination?.lng}&key=AIzaSyD3jCmxfmJm9Mm-XS9zSGZ-4eGAh-vqDs0
export const staticGoogleMapUrl = (trip: Trip) =>
  `https://maps.googleapis.com/maps/api/staticmap?size=300x200&maptype=roadmap&markers=color:red|label:A|${trip.origin?.lat},${trip.origin?.lng}&markers=color:red|label:B|${trip.destination?.lat},${trip.destination?.lng}&key=AIzaSyD3jCmxfmJm9Mm-XS9zSGZ-4eGAh-vqDs0`;

export const photoForUser = (user: User, size = '96x96') =>
  user?.photoURL ||
  `https://robohash.org/${user?.displayName}?size=${size}&set=${
    user?.gender === 'male' ? 'set1' : 'set4'
  }`;
