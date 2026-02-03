// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Password validation - minimum 6 characters
export const isValidPassword = (password) => {
  return password && password.length >= 6
}

// Username validation - 3-20 characters, alphanumeric
export const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
  return usernameRegex.test(username)
}

// Check if passwords match
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword
}

// Validate form data
export const validateRegisterForm = (data) => {
  const errors = {}

  if (!isValidUsername(data.username)) {
    errors.username = 'Username must be 3-20 characters, alphanumeric only'
  }

  if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email'
  }

  if (!isValidPassword(data.password)) {
    errors.password = 'Password must be at least 6 characters'
  }

  if (!passwordsMatch(data.password, data.confirmPassword)) {
    errors.confirmPassword = 'Passwords do not match'
  }

  return errors
}