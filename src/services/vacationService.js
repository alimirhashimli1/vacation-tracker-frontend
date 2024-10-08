import api from '../utils/api';

export const addVacation = async (vacationData, token) => {
  const response = await api.post('/vacations', vacationData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateVacation = async (vacationId, vacationData, token) => {
  const response = await api.put(`/vacations/${vacationId}`, vacationData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteVacation = async (vacationId, token) => {
  await api.delete(`/vacations/${vacationId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getAllVacations = async (token) => {
  const response = await api.get('/vacations/all', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
