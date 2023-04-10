import axios from '../config/axios';

export const getPosts = async () => axios.get('/posts');
export const createPost = async (data: any) => axios.post('/posts', data);
export const updatePost = async (id: number, data: any) =>
  axios.put(`/posts/${id}`, data);
export const getPost = async (id: string) => axios.get(`/posts/${id}`);
export const getPostComments = async (id: string) =>
  axios.get(`/posts/${id}/comments`);
