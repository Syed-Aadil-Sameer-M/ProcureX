import api from './api'

export interface InventoryItem {
  id: number
  material: string
  quantity: number
  price: number
  unit: string
  minStockLevel: number
  stockLevel: 'OK' | 'LOW' | 'CRITICAL'
}

export const inventoryService = {
  getAll: async (): Promise<InventoryItem[]> => {
    const response = await api.get('/inventory')
    // Bug 13: Use server-provided stockLevel, don't recalculate client-side
    return response.data
  },

  update: async (id: number, data: Partial<InventoryItem>) => {
    const response = await api.put(`/inventory/${id}`, data)
    return response.data
  },

  add: async (data: Omit<InventoryItem, 'id' | 'stockLevel'>) => {
    const response = await api.post('/inventory', data)
    return response.data
  }
}
