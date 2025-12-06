import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { message, code, language, analysisResult } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const systemPrompt = `You are a helpful AI code assistant. The user has analyzed some ${language || "code"} and may have questions about it.

${code ? `Code being analyzed:\n\`\`\`${language}\n${code}\n\`\`\`` : ""}

${
  analysisResult
    ? `Previous analysis results:
- Explanation: ${analysisResult.explanation || "N/A"}
- Bugs found: ${JSON.stringify(analysisResult.bugs || [])}
- Errors: ${analysisResult.error || "None"}`
    : ""
}

Provide helpful, accurate, and educational responses. Use code examples when appropriate.`

    const { text } = await generateText({
      model: "anthropic/claude-sonnet-4-20250514",
      system: systemPrompt,
      prompt: message,
      temperature: 0.7,
    })

    return NextResponse.json({
      response: text,
    })
  } catch (error: any) {
    console.error("[v0] AI Chat error:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to generate response",
      },
      { status: 500 },
    )
  }
}
