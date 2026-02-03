import { useState, useEffect } from 'react'
import { getNotes } from '../services/notesService'

// Notes page - displays user notes
export default function Notes() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch notes from API
    const loadNotes = async () => {
      try {
        const data = await getNotes()
        setNotes(data)
      } catch (error) {
        console.error('Error loading notes:', error)
      } finally {
        setLoading(false)
      }
    }
    loadNotes()
  }, [])

  return (
    <div>
      <h1>Notes</h1>
      {loading ? <p>Loading...</p> : <p>You have {notes.length} notes.</p>}
    </div>
  )
}