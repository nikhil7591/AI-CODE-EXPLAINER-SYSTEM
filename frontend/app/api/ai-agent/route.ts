export async function POST(request: Request) {
  try {
    const { userMessage, analysisContext } = await request.json()

    if (!userMessage) {
      return Response.json({ error: "Message is required" }, { status: 400 })
    }

    // Call backend API
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5001"
    const response = await fetch(`${backendUrl}/api/ai-agent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userMessage, analysisContext }),
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`)
    }

    const result = await response.json()
    return Response.json(result)
  } catch (error: any) {
    console.error("AI Agent error:", error)
    return Response.json({ error: error.message || "Failed to process request" }, { status: 500 })
  }
}
