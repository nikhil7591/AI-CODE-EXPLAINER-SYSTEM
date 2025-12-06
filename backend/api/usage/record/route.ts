import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import mongoose from "mongoose"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    await connectDB()
    const database = mongoose.connection.getClient().db("code-explainer")
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
    console.error("Usage record error:", error)
    return NextResponse.json({ error: "Failed to record usage" }, { status: 500 })
  }
}
