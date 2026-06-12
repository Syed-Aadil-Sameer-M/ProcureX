import api from './api'

export interface Vendor {
  id: number
  name: string
  contact: string
  email: string
  materials: string[]
}

export const vendorService = {
  getAll: async (): Promise<Vendor[]> => {
    const response = await api.get('/vendors')
    return response.data
  },

  add: async (data: Omit<Vendor, 'id'>): Promise<Vendor> => {
    const response = await api.post('/vendors', data)
    return response.data
  },

  update: async (id: number, data: Partial<Vendor>): Promise<Vendor> => {
    const response = await api.put(`/vendors/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/vendors/${id}`)
  }
}