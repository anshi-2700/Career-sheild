import axios from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('careershield_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('careershield_token');
      localStorage.removeItem('careershield_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (err: any, fallback: string = 'An unexpected error occurred'): string => {
  if (!err) return fallback;
  const detail = err.response?.data?.detail;
  if (detail) {
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      return detail.map((d: any) => (typeof d === 'string' ? d : d.msg || d.type || JSON.stringify(d))).join('; ');
    }
    if (typeof detail === 'object') {
      return detail.msg || JSON.stringify(detail);
    }
  }

  if (err.response?.status === 500) {
    if (fallback && fallback !== 'An unexpected error occurred') {
      return fallback;
    }
    return "Server connection is re-establishing. Please try your request again.";
  }

  if (err.message && typeof err.message === 'string' && !err.message.includes('status code')) {
    return err.message;
  }

  return fallback;
};
