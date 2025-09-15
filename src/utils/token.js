import api from './api';

export async function refreshToken(refreshToken) {
  const res = await api.post('/api/refresh', { refreshToken });
  return res.data.token;
}
