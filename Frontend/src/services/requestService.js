import api from './api';

export const getRequests = async () => {
  const response = await api.get('/requests');
  return response.data;
};

export const createRequest = async (request) => {
  const response = await api.post('/requests', request);
  return response.data;
};
