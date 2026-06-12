import api from './api';

export const auditLogService = {
  getAll: async () => {
    const response = await api.get('/audit-logs');
    return response.data;
  },
  getByModule: async (module: string) => {
    const response = await api.get(`/audit-logs/module/${module}`);
    return response.data;
  },
  getByAction: async (action: string) => {
    const response = await api.get(`/audit-logs/action/${action}`);
    return response.data;
  },
  getByUser: async (userId: number) => {
    const response = await api.get(`/audit-logs/user/${userId}`);
    return response.data;
  }
};
