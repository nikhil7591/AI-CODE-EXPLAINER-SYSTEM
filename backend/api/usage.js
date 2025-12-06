const express = require('express');
const router = express.Router();

// Import route handlers
const record = require('./usage/record');
const check = require('./usage/check');

// Routes
router.post('/record', record);
router.get('/check', check);

module.exports = router;
