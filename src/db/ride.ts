import axios from '../config/axios';

export const putLikeRide = (id: number) => {
  return axios.put(`/rides/${id}/like`);
};
