import api from '../utils/api';

export const loginUser = async (email, password) => {
  const response = await api.post('/users/login', { email, password });
  return response.data;
};

export const getUserProfile = async (token) => {
  const response = await api.get('/users/profile', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
