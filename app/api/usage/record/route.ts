import { NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const client = new MongoClient(uri)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    await client.connect()
    const database = client.db("AI-code-explainer")
    const users = database.collection("users")

    const user = await users.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Add usage record
    const usageRecord = {
      timestamp: new Date(),
      type: "ai_analysis"
    }

    await users.updateOne(
      { email },
      { 
        $push: { usageHistory: usageRecord } as any,
        $set: { lastUsage: new Date() }
      }
    )

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("Usage recording error:", error)
    return NextResponse.json({ error: "Failed to record usage" }, { status: 500 })
  } finally {
    await client.close()
  }
}
