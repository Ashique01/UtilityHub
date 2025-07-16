import api from './axiosInstance';

export const checkPing = async (host) => {
  const res = await api.post('/ping', { host });
  return res.data;
};