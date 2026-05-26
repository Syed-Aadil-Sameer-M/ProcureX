import api from './api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponseData {
  token: string
  username: string
  role: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  role: string
  fullName?: string
  department?: string
}

export const authService = {
login: async (credentials: LoginCredentials): Promise<LoginResponseData> => {
  const mockUsers: Record<string, LoginResponseData> = {
    'admin@test.com': { token: 'mock-token-admin', username: 'Admin User', role: 'ADMIN' },
    'receiver@test.com': { token: 'mock-token-receiver', username: 'Receiver User', role: 'RECEIVER' },
    'procurement@test.com': { token: 'mock-token-procurement', username: 'Procurement User', role: 'PROCUREMENT' },
  }
  const passwords: Record<string, string> = {
    'admin@test.com': 'admin123',
    'receiver@test.com': 'receiver123',
    'procurement@test.com': 'procurement123',
  }
  await new Promise(resolve => setTimeout(resolve, 800))
  const user = mockUsers[credentials.email]
  if (user && passwords[credentials.email] === credentials.password) {
    return user
  }
  throw new Error('Invalid credentials')
},

  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  logout: async () => {
    try {
      const response = await api.post('/auth/logout')
      return response.data
    } catch (error) {
      console.warn("Logout request failed, but clearing local state anyway", error)
      return { success: true }
    }
  },
}
