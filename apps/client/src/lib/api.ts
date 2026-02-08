import axios from 'axios';

const api = axios.create({
  // In Vite, use import.meta.env instead of process.env
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

export default api;