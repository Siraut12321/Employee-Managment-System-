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
      if (!isLoginRequest) {
        localStorage.removeItem('auth-storage');
        document.cookie = 'token=; path=/; max-age=0';
        window.location.href = '/login';
        return new Promise(() => {}); // suppress unhandledRejection after redirect
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
