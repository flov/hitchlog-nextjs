import axios from 'axios';
import { API_URL } from '../config';

export const createComment = async (postId: string, values: any) =>
  axios.get(`${API_URL}/posts/${postId}/create_comment`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
