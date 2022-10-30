import axios from 'axios';
import { API_URL } from '../config';

export const getPosts = async () =>
  axios.get(`${API_URL}/posts`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
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
