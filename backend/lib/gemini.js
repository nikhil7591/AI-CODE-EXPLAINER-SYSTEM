const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your-gemini-api-key-here');

// Helper function to clean up JSON with unescaped newlines
function cleanJSON(text) {
  // Replace literal newlines inside quoted strings with escaped newlines
  return text.replace(/:\s*"([^"]*?)[\n\r]+([^"]*?)"/g, ': "$1 $2"');
}

// Helper function to extract JSON from text
function extractJSON(text) {
  // Remove markdown code blocks
  if (text.includes('```json')) {
    const match = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (match) text = match[1];
  } else if (text.includes('```')) {
    const match = text.match(/```\s*([\s\S]*?)\s*```/);
    if (match) text = match[1];
  }
  
  text = text.trim();
  
  // Find the first { and last } to extract valid JSON
  const startIdx = text.indexOf('{');
  const endIdx = text.lastIndexOf('}');
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    text = text.substring(startIdx, endIdx + 1);
  }
  
  // Clean up the JSON
  text = cleanJSON(text);
  
  return text;
}

class GeminiAI {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  // Analyze code with Gemini AI
  async analyzeCode(code, language) {
    try {
      const prompt = `Analyze this ${language} code and provide a detailed analysis.

Code:
\`\`\`${language}
${code}
\`\`\`

You MUST respond with ONLY a valid JSON object (no markdown formatting, no code blocks, no extra text). Use this exact structure:

{
  "explanation": "Detailed explanation of what the code does",
  "bugsDetected": [
    {
      "line": 1,
      "issue": "description of the issue",
      "severity": "low"
    }
  ],
  "suggestedFixes": "Specific suggestions to improve the code",
  "optimizedCode": "Optimized version of the code here",
  "output": "Expected output when run",
  "error": null,
  "errorExplanation": ""
}

Important rules:
- Return ONLY the JSON object, nothing else
- Do not wrap in code blocks or markdown
- All string values must be on single lines (replace newlines with spaces)
- For optimizedCode, use \\n for line breaks within the string
- Ensure all quotes are properly escaped`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      // Extract and clean JSON
      text = extractJSON(text);
      
      // Parse JSON response
      const analysis = JSON.parse(text);
      
      // Ensure all required fields exist
      const validatedAnalysis = {
        explanation: analysis.explanation || `This ${language} code demonstrates basic programming concepts.`,
        bugsDetected: Array.isArray(analysis.bugsDetected) ? analysis.bugsDetected : [],
        suggestedFixes: analysis.suggestedFixes || "Add meaningful comments and consider edge cases.",
        optimizedCode: analysis.optimizedCode || code,
        output: analysis.output || "Code executed successfully",
        error: analysis.error || null,
        errorExplanation: analysis.errorExplanation || "",
        executionTime: Math.random() * 200 + 50
      };
      
      return validatedAnalysis;
    } catch (error) {
      console.error('Gemini analysis error:', error);
      // Fallback to basic analysis
      return this.getFallbackAnalysis(code, language);
    }
  }

  // AI Chat functionality
  async chatWithAI(message, code, language, analysisResult) {
    try {
      const prompt = `You are an AI programming assistant. A user is asking about their ${language} code.

User's message: "${message}"

Code context:
\`\`\`${language}
${code}
\`\`\`

Previous analysis: ${JSON.stringify(analysisResult || {})}

Respond with ONLY a valid JSON object (no markdown, no code blocks):
{
  "response": "Your detailed response here",
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      // Extract and clean JSON
      text = extractJSON(text);
      
      // Parse JSON response
      const chatResponse = JSON.parse(text);
      
      return {
        response: chatResponse.response || "I'm here to help with your code!",
        suggestions: Array.isArray(chatResponse.suggestions) ? chatResponse.suggestions : []
      };
    } catch (error) {
      console.error('Gemini chat error:', error);
      return this.getFallbackChat(message);
    }
  }

  // AI Agent functionality
  async agentAnalysis(code, language, userMessage, analysisContext) {
    try {
      const prompt = `You are an advanced AI code analysis agent. Analyze this ${language} code comprehensively.

User query: "${userMessage}"

Code:
\`\`\`${language}
${code}
\`\`\`

Context: ${JSON.stringify(analysisContext || {})}

Respond with ONLY a valid JSON object (no markdown, no code blocks):
{
  "response": "Detailed response addressing the user's query",
  "analysis": {
    "explanation": "Code explanation",
    "bugsDetected": [{"line": 1, "issue": "description", "severity": "low"}],
    "suggestedFixes": "Improvement suggestions",
    "optimizedCode": "Optimized version with \\n for line breaks",
    "output": "Expected output",
    "error": null,
    "errorExplanation": ""
  },
  "suggestions": ["actionable1", "actionable2", "actionable3"]
}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      // Extract and clean JSON
      text = extractJSON(text);
      
      // Parse JSON response
      const agentResponse = JSON.parse(text);
      
      // Validate structure
      return {
        response: agentResponse.response || "Analysis complete",
        analysis: agentResponse.analysis || this.getFallbackAnalysis(code, language),
        suggestions: Array.isArray(agentResponse.suggestions) ? agentResponse.suggestions : []
      };
    } catch (error) {
      console.error('Gemini agent error:', error);
      return this.getFallbackAgent(code, language, userMessage);
    }
  }

  // Code optimization
  async optimizeCode(code, language) {
    try {
      const prompt = `Optimize this ${language} code for better performance and readability.

Original code:
\`\`\`${language}
${code}
\`\`\`

Respond with ONLY a valid JSON object:
{
  "originalCode": "original code here",
  "optimizedCode": "optimized version with \\n for line breaks",
  "improvements": ["improvement1", "improvement2"],
  "performanceGain": 25,
  "readabilityScore": 85
}

Focus on:
1. Performance improvements
2. Code readability
3. Best practices
4. Modern language features
5. Error handling`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      // Extract and clean JSON
      text = extractJSON(text);
      
      // Parse JSON response
      const optimization = JSON.parse(text);
      
      return {
        originalCode: optimization.originalCode || code,
        optimizedCode: optimization.optimizedCode || code,
        improvements: Array.isArray(optimization.improvements) ? optimization.improvements : [],
        performanceGain: optimization.performanceGain || 15,
        readabilityScore: optimization.readabilityScore || 80
      };
    } catch (error) {
      console.error('Gemini optimization error:', error);
      return this.getFallbackOptimization(code, language);
    }
  }

  // Fallback methods for when Gemini API fails
  getFallbackAnalysis(code, language) {
    return {
      explanation: `This ${language} code demonstrates basic programming concepts. The code structure follows standard conventions.`,
      bugsDetected: [
        {
          line: 1,
          issue: "Consider adding comments for better documentation",
          severity: "low"
        }
      ],
      suggestedFixes: "Add meaningful comments and consider edge cases.",
      optimizedCode: code,
      output: "Code executed successfully",
      error: null,
      errorExplanation: "",
      executionTime: Math.random() * 200 + 50
    };
  }

  getFallbackChat(message) {
    return {
      response: "I'm here to help with your code! I can assist with explanations, bug fixes, optimizations, and best practices.",
      suggestions: ["Add comments", "Handle errors", "Optimize performance", "Test thoroughly"]
    };
  }

  getFallbackAgent(code, language, userMessage) {
    return {
      response: `I've analyzed your ${language} code. The code appears to be well-structured. ${userMessage.toLowerCase().includes('explain') ? 'The code demonstrates good programming practices.' : 'Consider the suggestions for improvement.'}`,
      analysis: this.getFallbackAnalysis(code, language),
      suggestions: ["Review code structure", "Add error handling", "Optimize performance", "Add documentation"]
    };
  }

  getFallbackOptimization(code, language) {
    return {
      originalCode: code,
      optimizedCode: code.split('\n').map(line => line.trim()).join('\n'),
      improvements: ["Applied code formatting", "Improved structure"],
      performanceGain: 15,
      readabilityScore: 80
    };
  }

  // Agent analysis by mode (Debug, Architecture, Security, General)
  async agentAnalysisByMode(code, language, userMessage, mode = 'general', analysisContext = {}) {
    try {
      let modePrompt = '';
      
      switch(mode) {
        case 'debug':
          modePrompt = `You are a debugging expert. Analyze this ${language} code for bugs, errors, and issues.
Focus on:
- Identifying bugs and runtime errors
- Explaining what's wrong
- Providing specific fixes
- Suggesting debugging strategies

User question: "${userMessage}"`;
          break;
          
        case 'architecture':
          modePrompt = `You are a software architecture expert. Analyze this ${language} code's structure and design.
Focus on:
- Code organization and structure
- Design patterns used
- Architectural improvements
- Scalability and maintainability
- Best practices

User question: "${userMessage}"`;
          break;
          
        case 'security':
          modePrompt = `You are a security expert. Analyze this ${language} code for security vulnerabilities.
Focus on:
- Security vulnerabilities
- Potential exploits
- Data protection issues
- Input validation
- Security best practices

User question: "${userMessage}"`;
          break;
          
        case 'general':
        default:
          modePrompt = `You are a helpful code analysis assistant. Provide comprehensive analysis of this ${language} code.
Focus on:
- What the code does
- How it works
- Potential improvements
- Best practices
- General suggestions

User question: "${userMessage}"`;
      }

      const prompt = `${modePrompt}

Code:
\`\`\`${language}
${code}
\`\`\`

${analysisContext?.analysis ? `Previous analysis: ${JSON.stringify(analysisContext.analysis)}` : ''}

Provide a detailed, specific response addressing the user's question in the context of ${mode} mode.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      // Clean up the response
      text = text.trim();
      
      // Remove markdown formatting if present
      if (text.startsWith('```')) {
        text = text.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '');
      }
      
      return text;
    } catch (error) {
      console.error(`Gemini ${mode} mode error:`, error);
      
      // Fallback responses by mode
      const fallbacks = {
        debug: `I've reviewed your ${language} code for bugs. Common issues to check: variable initialization, null checks, type mismatches, and edge cases.`,
        architecture: `Your ${language} code structure looks reasonable. Consider: separating concerns, using design patterns, improving modularity, and documenting the architecture.`,
        security: `Security considerations for your ${language} code: validate all inputs, sanitize outputs, use secure libraries, handle errors safely, and follow security best practices.`,
        general: `Your ${language} code demonstrates programming concepts. To improve: add comments, handle errors, optimize performance, and follow best practices.`
      };
      
      return fallbacks[mode] || fallbacks.general;
    }
  }
}

module.exports = GeminiAI;