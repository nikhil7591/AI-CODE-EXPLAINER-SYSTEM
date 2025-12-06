const express = require('express');
const router = express.Router();

const GeminiAI = require('../lib/gemini');
const gemini = new GeminiAI();

router.post('/', async (req, res) => {
  try {
    const { analysisId, userMessage, analysisContext } = req.body;
    
    if (!analysisContext) {
      return res.status(400).json({ error: 'Analysis context is required' });
    }
    
    const { code, language, mode = 'general' } = analysisContext;
    
    // Get mode-specific response from Gemini AI
    const result = await gemini.agentAnalysisByMode(code, language, userMessage, mode, analysisContext);
    
    res.json({ message: result });
  } catch (error) {
    console.error('AI Agent error:', error);
    res.status(500).json({ error: 'AI analysis failed' });
  }
});

module.exports = router;
