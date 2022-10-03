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

export const getTripsWithQuery = async (query: any) => {
  return axios.get(`${API_URL}/trips`, {
    params: query,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
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
) =>
  axios.get(`${API_URL}/trips`, {
    params: {
      q: {
        from_lat_gt: south_lat,
        from_lat_lt: north_lat,
        from_lng_gt: west_lng,
        from_lng_lt: east_lng,
      },
    },
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

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
  return axios
    .patch(`${API_URL}/rides/${values.id}`, payload, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${Cookies.get('authToken')}`,
      },
    })
    .then((res) => {
      return res;
    });
};
