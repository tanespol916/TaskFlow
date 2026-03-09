import axios from 'axios';
import { env } from 'process';

const api = axios.create({
  baseURL: env.VITE_API_URL || 'https://taskflow-production-cede.up.railway.app/api', // Default base URL backend 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
