import { useState, useEffect } from 'react'
import { getGameScores } from '../services/gameService'

// Games page - play games and track scores
export default function Games() {
  const [scores, setScores] = useState([])

  useEffect(() => {
    // Fetch game scores from API
    const loadScores = async () => {
      try {
        const data = await getGameScores()
        setScores(data)
      } catch (error) {
        console.error('Error loading scores:', error)
      }
    }
    loadScores()
  }, [])

  return (
    <div>
      <h1>Games</h1>
      <p>Top {scores.length} scores</p>
      <p>Games will be implemented here.</p>
    </div>
  )
}