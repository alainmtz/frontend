import axios from 'axios';
import { refreshToken as fetchRefreshToken } from './token';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Interceptor para refrescar el token antes de cada petición protegida
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  if (token) {
    // Verificar si el token está expirado
    const payload = (() => {
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch {
        return null;
      }
    })();
    if (payload && payload.exp && Date.now() / 1000 > payload.exp - 60 && refreshToken) {
      // Token expirado o por expirar, refrescar
      try {
        const newToken = await fetchRefreshToken(refreshToken);
        localStorage.setItem('token', newToken);
        config.headers.Authorization = `Bearer ${newToken}`;
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => Promise.reject(error));

export default api;
