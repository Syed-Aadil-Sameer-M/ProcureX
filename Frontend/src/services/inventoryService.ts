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
    return response.data.map((item: any) => ({
      ...item,
      // Calculate stock level indicator for frontend
      stockLevel: item.quantity <= 0 ? 'CRITICAL' : item.quantity < item.minStockLevel ? 'LOW' : 'OK'
    }))
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
