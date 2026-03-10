const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/google-login', userController.googleLogin);
router.get('/google-auth-url', userController.generateGoogleAuthUrl);
router.post('/google-callback', userController.googleCallback);

// Protected routes
router.get('/me', authMiddleware, userController.getCurrentUser);

module.exports = router;
