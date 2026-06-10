import api from '../api/axios';

export const googleAuthCallback = (code) =>
  api.post('/auth/google/callback', { code });

export const getMe = () =>
  api.get('/auth/me');

export const logoutUser = () =>
  api.post('/auth/logout');
