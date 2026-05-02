import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
})

// Attach auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('procurex_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('procurex_token')
      localStorage.removeItem('procurex_user_data')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
