import apiClient from './client';

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),

  getMe: () => apiClient.get('/auth/me'),

  createAdmin: (data: { name: string; email: string; password: string; role: string }) =>
    apiClient.post('/auth/register', data),
};
