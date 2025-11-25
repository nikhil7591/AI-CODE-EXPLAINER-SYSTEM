import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { AIAgent } from "@/lib/models"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { analysisId, userMessage, analysisContext } = await request.json()

    let agentRecord = await AIAgent.findOne({ analysisId })

    if (!agentRecord) {
      agentRecord = await AIAgent.create({
        analysisId,
        conversationHistory: [],
        debugSuggestions: [],
        architectureNotes: "",
        securityFindings: [],
      })
    }

    // Add user message to history
    agentRecord.conversationHistory.push({
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    })

    // Generate AI response based on context using Gemini
    const mode = analysisContext?.mode || "general"
    const modePrompts = {
      debug: "You are an expert debugging assistant. Focus on identifying and fixing bugs, errors, and issues in the code.",
      architecture: "You are an expert software architect. Focus on code structure, design patterns, and architectural improvements.",
      security: "You are a security expert. Focus on identifying security vulnerabilities, best practices, and secure coding patterns.",
      general: "You are an expert code analyzer and assistant. Provide comprehensive help with code understanding, optimization, and best practices.",
    }

    const systemPrompt = `${modePrompts[mode] || modePrompts.general}

Context: ${JSON.stringify(analysisContext?.analysis || {})}

Provide detailed, helpful responses. Use markdown formatting when appropriate.`

    const { text: assistantMessage } = await generateText({
      model: google("gemini-2.0-flash"),
      system: systemPrompt,
      prompt: userMessage,
      temperature: 0.7,
    })

    agentRecord.conversationHistory.push({
      role: "assistant",
      content: assistantMessage,
      timestamp: new Date(),
    })

    await agentRecord.save()

    return NextResponse.json({
      message: assistantMessage,
      conversationHistory: agentRecord.conversationHistory,
    })
  } catch (error: any) {
    console.error("AI Agent error:", error)
    return NextResponse.json({ error: error.message || "Failed to process AI request" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const searchParams = request.nextUrl.searchParams
    const analysisId = searchParams.get("analysisId")

    const agentRecord = await AIAgent.findOne({ analysisId })

    return NextResponse.json(agentRecord || { conversationHistory: [] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch AI agent data" }, { status: 500 })
  }
}
