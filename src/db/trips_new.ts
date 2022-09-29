import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '../config';

export const getTrips = async () => {
  const res = await fetch(`${API_URL}/trips`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  return data;
};

export const getTrip = async (trip_id: any) => {
  return axios.get(`${API_URL}/trips/${trip_id}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
};

export const getTripsByLocation = async (
  north_lat: number,
  south_lat: number,
  west_lng: number,
  east_lng: number
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/trips?north_lat=${north_lat}&south_lat=${south_lat}&west_lng=${west_lng}&east_lng=${east_lng}`
  );
  const trips = await res.json();
  return trips;
};

export const createTrip = (payload: any) => {
  return axios.post(`${API_URL}/trips`, payload, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${Cookies.get('authToken')}`,
    },
  });
};

export const updateRide = async (values: any) => {
  const payload = { ride: values };
  console.log({ payload });
  return axios
    .patch(`${API_URL}/rides/${values.id}`, payload, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${Cookies.get('authToken')}`,
      },
    })
    .then((res) => {
      console.log({ res });
      return res;
    });
};
