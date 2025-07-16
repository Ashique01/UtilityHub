import api from './axiosInstance';

export const fetchAllUrls = async (adminToken) => {
  const res = await api.get('/url/admin/all', {
    headers: { 'x-admin-token': adminToken },
  });
  return res.data;
};
