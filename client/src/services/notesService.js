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

// Notes API functions
export const getNotes = () => {
  return API.get('/notes')
}

export const getNoteById = (id) => {
  return API.get(`/notes/${id}`)
}

export const createNote = (noteData) => {
  return API.post('/notes', noteData)
}

export const updateNote = (id, noteData) => {
  return API.put(`/notes/${id}`, noteData)
}

export const deleteNote = (id) => {
  return API.delete(`/notes/${id}`)
}