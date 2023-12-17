import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '../config';

export const getLatestTrips = async () =>
  axios.get(`${API_URL}/trips/latest`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

export const getTripsWithQuery = async (query: any) => {
  return axios.get(`${API_URL}/trips`, {
    params: query,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
};

export const getRandomTrips = async (
  type: 'videos' | 'stories' | 'photos' | '' = '',
) => {
  return axios.get(`${API_URL}/trips/latest`, {
    params: type ? { [type]: true } : {},
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get('authToken')}`,
      Accept: 'application/json',
    },
  });
};

export const getTrip = async (trip_id: any) => {
  return axios.get(`${API_URL}/trips/${trip_id}`, {
    headers: {
      'Conten-Type': 'application/json',
      Accept: 'application/json',
    },
  });
};

export const getTripsByLocation = async (
  north_lat: number,
  south_lat: number,
  west_lng: number,
  east_lng: number,
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

export const deleteTrip = (id: number) => {
  return axios.delete(`${API_URL}/trips/${id}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${Cookies.get('authToken')}`,
    },
  });
};

export const updateTrip = (payload: any) => {
  return axios.put(`${API_URL}/trips/${payload.id}`, payload, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${Cookies.get('authToken')}`,
    },
  });
};

export const updateRide = (payload: any) => {
  return axios.patch(`${API_URL}/rides/${payload.id}`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
      Authorization: `Bearer ${Cookies.get('authToken')}`,
    },
  });
};
