import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '../config';

export const putLikeRide = (id: number) => {
  return axios.put(
    `${API_URL}/rides/${id}/like`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${Cookies.get('authToken')}`,
      },
    }
  );
};
