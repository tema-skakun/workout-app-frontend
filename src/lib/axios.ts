import axios from 'axios';

const api = axios.create({
  baseURL: 'https://workout-app-backend-myuo.onrender.com',
});

export default api;
