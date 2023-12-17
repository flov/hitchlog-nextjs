import axios, { AxiosResponse } from 'axios';
import { API_URL } from '../config';
import { AgeForTrip, LabelValue, Top10 } from '../types/Statistics';

export const getAgeForTrips = () =>
  axios.get<any, AxiosResponse<AgeForTrip[]>>(
    `${API_URL}/statistics/age_for_trips`,
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  );
export const getTop10 = () =>
  axios.get<any, AxiosResponse<Top10[]>>(`${API_URL}/statistics/top_10`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

export const genderStats = () =>
  axios.get<any, AxiosResponse<LabelValue[]>>(
    `${API_URL}/statistics/users_by_gender`,
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  );

export const waitingTimeStats = () =>
  axios.get<any, AxiosResponse<LabelValue[]>>(
    `${API_URL}/statistics/waiting_time`,
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  );
