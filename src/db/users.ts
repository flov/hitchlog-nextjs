import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '../config';

export const getUser = async (id: number | string) => {
  return axios.get(`${API_URL}/users/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${Cookies.get('authToken')}`,
    },
  });
};

export const getUserByUsername = async (id: number | string) => {
  return axios.get(`${API_URL}/users/${id}`, {
    params: {
      username: true,
    },
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${Cookies.get('authToken')}`,
    },
  });
};

export const getUsers = async (page = 1) => {
  return axios.get(`${API_URL}/users`, {
    params: { page },
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${Cookies.get('authToken')}`,
    },
  });
};
