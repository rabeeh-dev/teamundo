import api from '../api/axios';
import adminApi from '../api/adminApi';

export const getDistrictUsers = (district, profession = '') =>
  api.get('/users', { params: { district, profession } });

export const getUserProfile = (userId) =>
  api.get(`/users/${userId}`);

// Admin and Warnings
export const getAdminUsers = (district = '', profession = '') => adminApi.get('/admin/users', { params: { district, profession } });
export const getAdminUserById = (id) => adminApi.get(`/admin/users/${id}`);
export const sendAdminWarning = (id, message) => adminApi.post(`/admin/users/${id}/warn`, { message });
export const toggleUserBlock = (id) => adminApi.put(`/admin/users/${id}/block`);
export const markWarningRead = (warningId) => api.put(`/users/warnings/${warningId}/read`);

export const searchUsers = (query) =>
  api.get('/users/search', { params: { q: query } });

export const completeOnboarding = (data) =>
  api.post('/users/onboarding', data);

export const updateProfile = (data) =>
  api.put('/profile/update', data);
