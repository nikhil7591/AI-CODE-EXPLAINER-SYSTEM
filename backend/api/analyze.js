const express = require('express');
const router = express.Router();
const GeminiAI = require('../lib/gemini');

const gemini = new GeminiAI();

router.post('/', async (req, res) => {
  try {
    const { code, language } = req.body;
    
    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }
    
    // Use Gemini AI for real analysis
    const result = await gemini.analyzeCode(code, language);
    result.id = Date.now().toString();
    
    res.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

module.exports = router;
