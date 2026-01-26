// Footer component for the application
export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p>&copy; 2026 MERN Lab Project. All rights reserved.</p>
        <p>A beginner-friendly MERN stack boilerplate for learning web development.</p>
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    backgroundColor: 'var(--secondary-color)',
    color: 'var(--text-light)',
    padding: '2rem',
    textAlign: 'center',
    marginTop: 'auto'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  }
}