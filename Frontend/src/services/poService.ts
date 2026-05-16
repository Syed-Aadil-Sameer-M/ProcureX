import api from './api'

export const poService = {
  getAll: async () => {
    const response = await api.get('/purchase-orders')
    return response.data
  },

  updateStatus: async (id: number, status: string) => {
    const response = await api.put(`/purchase-orders/${id}/status`, { status })
    return response.data
  }
}
