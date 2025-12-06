import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

// In-memory conversation storage (for demo purposes)
const conversations = new Map<string, Array<{ role: string; content: string; timestamp: Date }>>()

export async function POST(request: NextRequest) {
  try {
    const { analysisId, userMessage, analysisContext } = await request.json()

    // Get or create conversation history
    const conversationHistory = conversations.get(analysisId) || []

    // Add user message to history
    conversationHistory.push({
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    })

    // Generate AI response based on context
    const mode = analysisContext?.mode || "general"
    const modePrompts: Record<string, string> = {
      debug:
        "You are an expert debugging assistant. Focus on identifying and fixing bugs, errors, and issues in the code.",
      architecture:
        "You are an expert software architect. Focus on code structure, design patterns, and architectural improvements.",
      security:
        "You are a security expert. Focus on identifying security vulnerabilities, best practices, and secure coding patterns.",
      general:
        "You are an expert code analyzer and assistant. Provide comprehensive help with code understanding, optimization, and best practices.",
    }

    const systemPrompt = `${modePrompts[mode] || modePrompts.general}

Context from previous analysis: ${JSON.stringify(analysisContext?.analysis || {})}

Provide detailed, helpful responses. Use markdown formatting when appropriate. Be concise but thorough.`

    const { text: assistantMessage } = await generateText({
      model: "anthropic/claude-sonnet-4-20250514",
      system: systemPrompt,
      prompt: userMessage,
      temperature: 0.7,
    })

    // Add assistant message to history
    conversationHistory.push({
      role: "assistant",
      content: assistantMessage,
      timestamp: new Date(),
    })

    // Store updated conversation
    conversations.set(analysisId, conversationHistory)

    return NextResponse.json({
      message: assistantMessage,
      conversationHistory: conversationHistory,
    })
  } catch (error: any) {
    console.error("[v0] AI Agent error:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to process AI request",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const analysisId = searchParams.get("analysisId")

    if (!analysisId) {
      return NextResponse.json({ conversationHistory: [] })
    }

    const conversationHistory = conversations.get(analysisId) || []
    return NextResponse.json({ conversationHistory })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch AI agent data",
      },
      { status: 500 },
    )
  }
}
