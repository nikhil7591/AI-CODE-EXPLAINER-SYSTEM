export async function POST(request: Request) {
  try {
    const { code, language } = await request.json()

    if (!code) {
      return Response.json({ error: "Code is required" }, { status: 400 })
    }

    // Call backend API
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5001"
    const response = await fetch(`${backendUrl}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language }),
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`)
    }

    const result = await response.json()
    return Response.json(result)
  } catch (error: any) {
    console.error("Analysis error:", error)
    return Response.json({ error: error.message || "Analysis failed" }, { status: 500 })
  }
}
