const express = require('express');
const router = express.Router();

const GeminiAI = require('../lib/gemini');
const gemini = new GeminiAI();

router.post('/', async (req, res) => {
  try {
    const { originalCode, optimizedCode, language } = req.body;
    
    if (!originalCode || !language) {
      return res.status(400).json({ error: 'Original code and language are required' });
    }
    
    // Use Gemini AI for real optimization
    const result = await gemini.optimizeCode(originalCode, language);
    
    // If user provided their own optimized version, compare with ours
    let comparison = null;
    if (optimizedCode) {
      comparison = {
        userOptimized: optimizedCode,
        aiOptimized: result.optimizedCode,
        similarities: calculateSimilarity(optimizedCode, result.optimizedCode),
        recommendation: getComparisonRecommendation(optimizedCode, result.optimizedCode)
      };
    }
    
    res.json({
      ...result,
      comparison,
      metrics: {
        linesOfCode: originalCode.split('\n').length,
        optimizedLines: result.optimizedCode.split('\n').length,
        complexity: calculateComplexity(originalCode),
        optimizedComplexity: calculateComplexity(result.optimizedCode)
      }
    });
  } catch (error) {
    console.error('Comparison error:', error);
    res.status(500).json({ error: 'Comparison failed' });
  }
});

function calculateSimilarity(code1, code2) {
  const lines1 = code1.split('\n').filter(line => line.trim());
  const lines2 = code2.split('\n').filter(line => line.trim());
  const commonLines = lines1.filter(line => lines2.includes(line));
  return Math.round((commonLines.length / Math.max(lines1.length, lines2.length)) * 100);
}

function getComparisonRecommendation(userCode, aiCode) {
  const similarity = calculateSimilarity(userCode, aiCode);
  if (similarity > 80) {
    return 'Great job! Your optimization is very similar to the AI suggestion.';
  } else if (similarity > 50) {
    return 'Good attempt! Consider the AI suggestions for additional improvements.';
  } else {
    return 'The AI optimization offers significant improvements over your version.';
  }
}

function calculateComplexity(code) {
  // Simple complexity calculation based on control structures
  const complexityKeywords = ['if', 'else', 'for', 'while', 'switch', 'case', 'catch', 'try'];
  let complexity = 1; // Base complexity
  
  complexityKeywords.forEach(keyword => {
    const matches = code.match(new RegExp(`\\b${keyword}\\b`, 'g'));
    if (matches) complexity += matches.length;
  });
  
  return complexity;
}

module.exports = router;
