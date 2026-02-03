import { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext'

// Toggle between light and dark theme
export default function ThemeToggle() {
  const { isDark, toggleTheme } = useContext(ThemeContext)

  return (
    <button
      onClick={toggleTheme}
      style={styles.button}
      aria-label="Toggle theme"
    >
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}

const styles = {
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    border: '1px solid white',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500'
  }
}