import axios from '../config/axios';

export const createPostComment = async (postId: number, values: any) =>
  axios.post(`/posts/${postId}/create_comment`, { post_comment: values });

export const createTripComment = async (tripId: number, values: any) =>
  axios.post(`/trips/${tripId}/create_comment`, { comment: values });
