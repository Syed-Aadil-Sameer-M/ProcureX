import api from './api'

export const poService = {
  getAll: async () => {
    const response = await api.get('/purchase-orders')
    return response.data
  },

  create: async (data: { requestId: string | number; material: string; vendorId: number; quantity: number }) => {
    const response = await api.post('/purchase-orders', data)
    return response.data
  },

  updateStatus: async (id: number, status: string) => {
    const response = await api.put(`/purchase-orders/${id}/status`, { status })
    return response.data
  }
}