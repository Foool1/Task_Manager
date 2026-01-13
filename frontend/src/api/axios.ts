import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8002',  // Dla dev; w Dockerze zmień na 'http://backend:8000'
});

export default api;