import axios from 'axios';
import { API_URL } from '@/constants';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const storage = localStorage.getItem('auth-storage');
    if (storage) {
      const { state } = JSON.parse(storage);
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      const isAlreadyOnLogin = window.location.pathname === '/login';
      if (!isLoginRequest && !isAlreadyOnLogin) {
        localStorage.removeItem('auth-storage');
        document.cookie = 'token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        window.location.replace('/login');
        return new Promise(() => {});
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
