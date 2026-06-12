import api from './api';

export interface User {
  id?: number;
  username: string;
  email: string;
  role: string;
  fullName: string;
  department: string;
  phoneNumber?: string;
  password?: string;
}

export const userService = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  create: async (user: User) => {
    const response = await api.post('/users', user);
    return response.data;
  },

  update: async (id: number, user: User) => {
    const response = await api.put(`/users/${id}`, user);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};
