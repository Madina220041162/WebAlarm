// Centralized error handling middleware
export const errorHandler = (error, req, res, next) => {
  console.error('Error:', error.message)

  // Default error
  let status = error.status || 500
  let message = error.message || 'Internal server error'

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    status = 400
    message = 'Validation error'
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    status = 400
    message = 'Duplicate field value'
  }

  res.status(status).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error : {}
  })
}

export default errorHandler