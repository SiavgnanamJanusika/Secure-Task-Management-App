import axios from 'axios';
import { API_BASE } from '../utils/constants';
import { getToken } from '../utils/auth';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
