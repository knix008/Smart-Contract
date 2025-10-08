const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Simple authentication middleware (in production, use proper authentication)
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authorization token required'
    });
  }

  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
};

// Login endpoint (simplified for demo)
router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { username, password } = req.body;

  // Simple credential check (in production, use proper user management)
  const validCredentials = {
    'issuer': 'issuer123',
    'admin': 'admin123'
  };

  if (!validCredentials[username] || validCredentials[username] !== password) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }

  // Generate JWT token
  const token = jwt.sign(
    { 
      username, 
      role: username === 'admin' ? 'admin' : 'issuer',
      iat: Math.floor(Date.now() / 1000)
    },
    process.env.JWT_SECRET || 'default-secret',
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    data: {
      token,
      user: {
        username,
        role: username === 'admin' ? 'admin' : 'issuer'
      },
      expiresIn: '24h'
    }
  });
});

// Verify token endpoint
router.post('/verify', authenticate, (req, res) => {
  res.json({
    success: true,
    data: {
      valid: true,
      user: req.user
    }
  });
});

// Logout endpoint (client-side token removal)
router.post('/logout', authenticate, (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'Logged out successfully'
    }
  });
});

// Get current user info
router.get('/me', authenticate, (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
});

module.exports = router;