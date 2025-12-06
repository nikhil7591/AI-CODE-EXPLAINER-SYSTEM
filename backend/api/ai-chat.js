const express = require('express');
const router = express.Router();
const GeminiAI = require('../lib/gemini');

const gemini = new GeminiAI();

router.post('/', async (req, res) => {
  try {
    const { message, code, language, analysisResult } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Use Gemini AI for real chat
    const result = await gemini.chatWithAI(message, code, language, analysisResult);
    res.json(result);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Chat processing failed' });
  }
});

module.exports = router;
