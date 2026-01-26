import app from './app.js'
import { connectDB } from './config/db.js'

const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})