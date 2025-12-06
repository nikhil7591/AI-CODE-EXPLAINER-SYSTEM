const express = require('express');
const router = express.Router();

// Import route handlers
const userData = require('./user/data');

// Routes
router.get('/data', userData.get);
router.put('/data', userData.put);

module.exports = router;
