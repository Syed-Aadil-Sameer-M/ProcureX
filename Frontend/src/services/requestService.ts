import api from './api'

export interface CreateRequestData {
  material: string
  quantity: number
  location: string
  description?: string
}

export const requestService = {
  getAll: async (params?: { page?: number; size?: number; status?: string }) => {
    const response = await api.get('/requests', { params })
    return response.data
  },

  getMy: async (params?: { page?: number; size?: number }) => {
    const response = await api.get('/requests/my', { params })
    return response.data
  },

  create: async (data: CreateRequestData) => {
    const response = await api.post('/requests/create', data)
    return response.data
  },

  getById: async (id: number) => {
    const response = await api.get(`/requests/${id}`)
    return response.data
  },

  updateStatus: async (id: number, status: string) => {
    const response = await api.patch(`/requests/${id}/status`, { status })
    return response.data
  },
}
