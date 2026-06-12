import api from './api'

export interface CreateRequestData {
  material: string
  quantity: number
  location: string
  description?: string
}

export const requestService = {
  getAll: async () => {
    const response = await api.get('/requests')
    return response.data
  },

  getMy: async () => {
    const response = await api.get('/requests/my')
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
