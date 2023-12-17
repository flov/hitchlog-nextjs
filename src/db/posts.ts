import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '../config';

export const getPosts = async () =>
  axios.get(`${API_URL}/posts`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

export const createPost = async (data: any) =>
  axios.post(`${API_URL}/posts`, data, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${Cookies.get('authToken')}`,
    },
  });

export const updatePost = async (id: number, data: any) =>
  axios.put(`${API_URL}/posts/${id}`, data, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${Cookies.get('authToken')}`,
    },
  });

export const getPost = async (id: string) =>
  axios.get(`${API_URL}/posts/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

export const getPostComments = async (id: string) =>
  axios.get(`${API_URL}/posts/${id}/comments`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
