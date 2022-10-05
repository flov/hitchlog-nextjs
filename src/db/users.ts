import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '../config';

export const authenticateToken = async (token: string | undefined) =>
  axios.get(`${API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
    },
  });

export const getGeomap = async (id: string | number) =>
  axios.get(`${API_URL}/users/${id}/geomap`, {
    headers: {
      accept: 'application/json',
    },
  });

export const postLogin = async (values: {
  email: string;
  password: string;
}) => {
  axios.post(`${API_URL}/users/sign_in`, { user: values });
};

export const getUser = async (id: number | string) => {
  return axios.get(`${API_URL}/users/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${Cookies.get('authToken')}`,
    },
  });
};

export const fetchProfile = async (id: number | string) => {
  return axios.get(`${API_URL}/users/${id}/profile`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${Cookies.get('authToken')}`,
    },
  });
};

export const getUserByUsername = async (username: string) => {
  return axios.get(`${API_URL}/users/${username}`, {
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

export const updateUser = async (username: string, values: any) => {
  return axios.patch(
    `${API_URL}/users/${username}`,
    { user: values },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${Cookies.get('authToken')}`,
      },
    }
  );
};
