const express = require('express');
const router = express.Router();

// Import route handlers
const signup = require('./auth/signup');
const login = require('./auth/login');

// Routes
router.post('/signup', signup);
router.post('/login', login);

module.exports = router;
