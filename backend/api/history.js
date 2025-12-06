const express = require('express');
const router = express.Router();

// Mock history data
const mockHistory = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    code: 'print("Hello World")',
    language: 'python',
    explanation: 'Simple Hello World program in Python',
    bugsDetected: [],
    suggestedFixes: 'No issues found'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    code: 'function add(a, b) { return a + b; }',
    language: 'javascript',
    explanation: 'Simple addition function in JavaScript',
    bugsDetected: [],
    suggestedFixes: 'Consider adding input validation'
  }
];

router.get('/', async (req, res) => {
  try {
    // In a real implementation, this would fetch from database
    // For now, return mock data
    res.json(mockHistory);
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;
