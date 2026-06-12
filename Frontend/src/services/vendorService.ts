import api from './api';

export const vendorService = {
  getAll: async () => {
    const response = await api.get('/vendors');
    return response.data;
  },
  create: async (vendor: any) => {
    const response = await api.post('/vendors', vendor);
    return response.data;
  },
  update: async (id: number, vendor: any) => {
    const response = await api.put(`/vendors/${id}`, vendor);
    return response.data;
  }
};