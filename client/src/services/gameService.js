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

// Games API functions
export const getGameScores = () => {
  return API.get('/games/scores')
}

export const submitScore = (gameId, score) => {
  return API.post('/games/scores', { gameId, score })
}

export const getLeaderboard = () => {
  return API.get('/games/leaderboard')
}