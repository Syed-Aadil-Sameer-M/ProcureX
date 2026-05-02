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
    const response = await api.post('/auth/login', credentials)
    return response.data
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
    const response = await api.post('/auth/logout')
    return response.data
  },
}
