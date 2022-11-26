import axios, { AxiosResponse } from 'axios';
import { API_URL } from '../config';
import { AgeForTrip, Top10 } from '../types/Statistics';

export const getAgeForTrips = () =>
  axios.get<any, AxiosResponse<AgeForTrip[]>>(
    `${API_URL}/statistics/age_for_trips`,
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
  );
export const getTop10 = () =>
  axios.get<any, AxiosResponse<Top10[]>>(`${API_URL}/statistics/top_10`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
