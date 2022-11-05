import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '../config';

export const createPostComment = async (postId: number, values: any) =>
  axios.post(
    `${API_URL}/posts/${postId}/create_comment`,
    { post_comment: values },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${Cookies.get('authToken')}`,
      },
    }
  );

export const createTripComment = async (tripId: number, values: any) =>
  axios.post(
    `${API_URL}/trips/${tripId}/create_comment`,
    { comment: values },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${Cookies.get('authToken')}`,
      },
    }
  );
