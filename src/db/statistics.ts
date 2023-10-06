import { AxiosResponse } from 'axios';

import axios from '../config/axios';
import { AgeForTrip, LabelValue, Top10 } from '../types/Statistics';

export const getAgeForTrips = () =>
  axios.get<any, AxiosResponse<AgeForTrip[]>>('statistics/age_for_trips');
export const getTop10 = () =>
  axios.get<any, AxiosResponse<Top10[]>>('/statistics/top_10');
export const genderStats = () =>
  axios.get<any, AxiosResponse<LabelValue[]>>('/statistics/users_by_gender');
export const waitingTimeStats = () =>
  axios.get<any, AxiosResponse<LabelValue[]>>('/statistics/waiting_time');
