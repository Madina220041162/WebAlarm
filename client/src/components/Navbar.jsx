import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'

// Navigation bar component with links to all pages
export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>
        <Link to="/" style={styles.logo}>
          <h2>MERN Lab</h2>
        </Link>
        {isAuthenticated && (
          <ul style={styles.navLinks}>
            <li><Link to="/dashboard" style={styles.link}>Dashboard</Link></li>
            <li><Link to="/notes" style={styles.link}>Notes</Link></li>
            <li><Link to="/calendar" style={styles.link}>Calendar</Link></li>
            <li><Link to="/alarm" style={styles.link}>Alarm</Link></li>
            <li><Link to="/games" style={styles.link}>Games</Link></li>
          </ul>
        )}
        <div style={styles.rightSection}>
          {isAuthenticated && user && (
            <span style={styles.userInfo}>Hi, {user.name}!</span>
          )}
          <ThemeToggle />
          {isAuthenticated && (
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          )}
        </div>
      </div>
    </nav>
  )
}

const styles = {
  navbar: {
    backgroundColor: 'var(--primary-color)',
    padding: '1rem 0',
    borderBottom: '2px solid #2980b9'
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingX: '20px',
    padding: '0 20px'
  },
  logo: {
    color: 'white',
    textDecoration: 'none'
  },
  navLinks: {
    display: 'flex',
    listStyle: 'none',
    gap: '2rem',
    flex: 1,
    marginLeft: '2rem'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500'
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  userInfo: {
    color: 'white',
    fontSize: '0.95rem'
  },
  logoutBtn: {
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