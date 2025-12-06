import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export async function POST(request: NextRequest) {
  try {
    const { message, code, language, analysisResult } = await request.json()

    if (!message || !code) {
      return NextResponse.json({ error: "Message and code are required" }, { status: 400 })
    }

    // Create context for the AI
    const systemPrompt = `You are CodeMind, an expert AI code assistant. You help developers understand, debug, and optimize their code.
    
Current Code Context:
- Language: ${language}
- Code: ${code}
- Previous Analysis: ${JSON.stringify(analysisResult)}

Provide concise, helpful responses focused on the code. Use markdown formatting. Keep responses under 150 words.`

    // Use Google Gemini instead of OpenAI
    const { text } = await generateText({
      model: google("gemini-2.0-flash"),
      system: systemPrompt,
      prompt: message,
      temperature: 0.7,
      maxTokens: 200,
    })

    return NextResponse.json({ response: text })
  } catch (error: any) {
    console.error("AI Chat error:", error)
    return NextResponse.json({ error: error.message || "Failed to generate response" }, { status: 500 })
  }
}
