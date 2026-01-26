import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Login page with basic form
export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // For demo: accept any email/password
    if (!email || !password) {
      setError('Please enter email and password')
      return
    }

    // Simulate login
    const user = {
      email,
      name: email.split('@')[0], // Use email prefix as name
      id: Math.random().toString(36).substr(2, 9)
    }

    login(user)
    navigate('/dashboard')
  }

  return (
    <div style={styles.container}>
      <h1>Login</h1>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            placeholder="test@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Any password works (demo)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <button type="submit" style={styles.button}>Login</button>
      </form>
      <p style={styles.hint}>💡 Demo mode: Use any email and password</p>
    </div>
  )
}

const styles = {
  container: { padding: '2rem', maxWidth: '500px', margin: '0 auto' },
  form: { maxWidth: '400px', margin: '2rem 0' },
  formGroup: { marginBottom: '1.5rem' },
  input: { width: '100%', padding: '0.75rem', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
  button: { padding: '0.75rem 1.5rem', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', width: '100%' },
  error: { color: 'red', marginBottom: '1rem' },
  hint: { marginTop: '1rem', fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }
}