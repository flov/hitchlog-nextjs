import axios from 'axios';

import { EXPERIENCES, IpLocation, Trip, User } from '../types';

export const capitalize = (s: string) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

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

export const fetchIpAddressOfClient = async () => {
  const response = await fetch('https://api.ipify.org?format=json');
  const { ip } = await response.json();
  return ip;
};

export const fetchLocationFromClient = async () => {
  const ipAddress = await fetchIpAddressOfClient();
  const response = await axios.get(
    `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.NEXT_PUBLIC_IPLOCATION}&ip=${ipAddress}`
  );
  const IpLocation = response.data;
  return IpLocation as IpLocation;
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
  `https://robohash.org/${user.username}?size=${size}&set=${
    user?.gender === 'male' ? 'set1' : 'set4'
  }`;

export const profilePicture = (md5_email: string, size = 64) =>
  `https://www.gravatar.com/avatar/${md5_email}?s=${size}`;

// execute function x times with 1 second in between
export const executeNTimes = (fn: () => void, n: number) => {
  if (!n) return;
  fn();
  const interval = setTimeout(() => {
    executeNTimes(fn, n - 1);
  }, 1000);
};

const randomInRange = (min: number, max: number) =>
  Math.random() * (max - min) + min;

export const randomConfetti = () => {
  window.confetti({
    angle: randomInRange(55, 125),
    spread: randomInRange(50, 70),
    particleCount: randomInRange(50, 100),
    origin: { y: 0.6 },
  });
};

export const getDataFromAddressComponents = (
  address_components: google.maps.GeocoderAddressComponent[] | undefined
) => {
  if (!address_components) return {};
  const city = address_components.find((component) =>
    component.types.includes('locality')
  );
  const country = address_components.find((component) =>
    component.types.includes('country')
  );
  return {
    city: city ? city.long_name : '',
    country: country ? country.long_name : '',
    country_code: country ? country.short_name : '',
  };
};

export const getOrdinalNumber = (n: number) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const secondsToHumanReadable = (seconds: number) => {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
  const array = [];
  if (days) array.push(`${days}d`);
  if (hours) array.push(`${hours}h`);
  if (minutes) array.push(`${minutes}m`);
  return array.join(' ');
};

export const objectToString = (obj: any) => {
  return Object.entries(obj)
    .map(([key, value]) => `${key}: ${value}`)
    .join(' ');
};
