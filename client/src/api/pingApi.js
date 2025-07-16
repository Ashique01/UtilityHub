import api from './axiosInstance';

export const shortenUrl = async (originalUrl) => {
  const res = await api.post('/url/shorten', { originalUrl });
  return res.data;
};

export const getUrlStats = async (shortCode) => {
  const res = await api.get(`/url/stats/${shortCode}`);
  return res.data;
};
