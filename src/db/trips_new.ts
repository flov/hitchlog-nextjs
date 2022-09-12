import trips from '../../pages/trips';
import { API_URL } from '../config';
import { Ride, Trip } from '../types';

export const getTrips = async () => {
  const res = await fetch(`${API_URL}/trips`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  return data;
};

export const getTripsByLocation = async (
  north_lat: number,
  south_lat: number,
  west_lng: number,
  east_lng: number
) => {
  const res = await fetch(
    `${API_URL}/trips?north_lat=${north_lat}&south_lat=${south_lat}&west_lng=${west_lng}&east_lng=${east_lng}`
  );
  const trips = await res.json();
  return trips;
};
