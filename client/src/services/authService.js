import axios from 'axios'

// Create axios instance with base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api'
})

// Add token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth API functions
export const login = (email, password) => {
  return API.post('/auth/login', { email, password })
}

export const register = (username, email, password) => {
  return API.post('/auth/register', { username, email, password })
}

export const logout = () => {
  localStorage.removeItem('authToken')
}

export const getCurrentUser = () => {
  return API.get('/auth/me')
}