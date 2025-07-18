import axios from 'axios';

const api = axios.create({
  baseURL: 'https://utilityhub.onrender.com/api',
});

export default api;