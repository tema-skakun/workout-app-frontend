import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:3001',
  baseURL: 'https://workout-app-backend-myuo.onrender.com',
});

export default api;
