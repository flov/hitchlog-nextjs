import axios from '../config/axios';

export const authenticateToken = async (token: string | undefined) =>
  axios.get('/users/me');

export const confirmAccount = async (token: string) =>
  axios.post('/users/confirm');

export const sendMessage = async (message: string, username: string) =>
  axios.post(`/users/${username}/send_message`, { message });

export const postContactForm = async (payload: any) =>
  axios.post(`/mails/contact_form`, { contact_form: payload });

export const getGeomap = async (id: string | number) =>
  axios.get(`/users/${id}/geomap`);

export const postLogin = async (values: { email: string; password: string }) =>
  axios.post(`/users/sign_in`, { user: values });

export const getUser = async (id: number | string) => axios.get(`/users/${id}`);

export const fetchProfile = async (id: number | string) =>
  axios.get(`/users/${id}/profile`);

export const getUserByUsername = async (username: string) =>
  axios.get(`/users/${username}`);

export const getUsers = async (page = 1) =>
  axios.get(`/users`, {
    params: { page },
  });

export const createUser = async (values: any) =>
  axios.post(`/users`, { user: values });
export const updateUser = async (username: string, values: any) =>
  axios.patch(`/users/${username}`, { user: values });
export const resetPassword = async (values: { email: string }) =>
  axios.put('/users/password', { user: { ...values } });

export const postResetPassword = async (values: { email: string }) =>
  axios.post(`/users/password`, { user: values });
