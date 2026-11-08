import axios from 'axios';

export const TOKEN_KEY = 'ambagan_token';

// All API calls go through this instance: it attaches the JWT automatically.
const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Turn any API error into a readable message for the UI.
export function getErrorMessage(err) {
  return err?.response?.data?.message || err?.message || 'Something went wrong';
}

export default api;
