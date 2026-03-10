const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Hash password
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Generate JWT token
const generateToken = (userId, email) => {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET || '123456', { expiresIn: '7d' });
};

// Register user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // Hash password
    const passwordHash = hashPassword(password);

    // Create new user
    const newUser = new User({
      username,
      email,
      passwordHash,
    });

    await newUser.save();

    // Generate token
    const token = generateToken(newUser._id, newUser.email);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: newUser._id, username: newUser.username, email: newUser.email },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check password
    const passwordHash = hashPassword(password);
    if (user.passwordHash !== passwordHash) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate token
    const token = generateToken(user._id, user.email);

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
};

// Google login user
exports.googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: 'Google ID token is required' });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: 'GOOGLE_CLIENT_ID is not configured' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload?.email) {
      return res.status(400).json({ message: 'Unable to read Google account email' });
    }

    let user = await User.findOne({ email: payload.email });
    if (!user) {
      const baseUsername = (payload.name || payload.email.split('@')[0] || 'google-user')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .slice(0, 20) || 'googleuser';

      let username = baseUsername;
      let counter = 1;
      while (await User.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter += 1;
      }

      user = await User.create({
        username,
        email: payload.email,
        googleId: payload.sub,
        authProvider: 'google',
      });
    }

    const token = generateToken(user._id, user.email);
    return res.status(200).json({
      message: 'Google login successful',
      token,
      user: { id: user._id, username: user.username, email: user.email, authProvider: user.authProvider || 'local' },
    });
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(401).json({ message: 'Google login failed', error: error.message });
  }
};

// Generate Google OAuth URL (for redirect-based OAuth flow)
exports.generateGoogleAuthUrl = async (req, res) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: 'GOOGLE_CLIENT_ID is not configured' });
    }

    const redirectUri = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/google-callback`;
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile`;
    
    res.json({ authUrl });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate Google auth URL', error: error.message });
  }
};

// Handle Google OAuth callback and exchange code for token
exports.googleCallback = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Authorization code is required' });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: 'GOOGLE_CLIENT_ID is not configured' });
    }

    // For demo purposes: exchange code via Google's token endpoint
    // In production, use a library like googleapis or direct HTTP call
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET || 'demo_secret',
        redirect_uri: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/google-callback`,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();
    const idToken = tokenData.id_token;

    if (!idToken) {
      return res.status(400).json({ message: 'No ID token received from Google' });
    }

    // Verify ID token using the same googleLogin logic
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload?.email) {
      return res.status(400).json({ message: 'Unable to read Google account email' });
    }

    let user = await User.findOne({ email: payload.email });
    if (!user) {
      const baseUsername = (payload.name || payload.email.split('@')[0] || 'google-user')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .slice(0, 20) || 'googleuser';

      let username = baseUsername;
      let counter = 1;
      while (await User.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter += 1;
      }

      user = await User.create({
        username,
        email: payload.email,
        googleId: payload.sub,
        authProvider: 'google',
      });
    }

    const token = generateToken(user._id, user.email);
    return res.status(200).json({
      message: 'Google login successful',
      token,
      user: { id: user._id, username: user.username, email: user.email, authProvider: user.authProvider || 'local' },
    });
  } catch (error) {
    console.error('Google callback error:', error);
    return res.status(401).json({ message: 'Google callback failed', error: error.message });
  }
};
