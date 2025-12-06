import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import mongoose from "mongoose"

const FREE_LIMIT = 3 // 3 free analyses per day

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

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

    // Get today's usage
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Start of today
    
    const usageCount = user.usageHistory?.filter((usage: any) => {
      const usageDate = new Date(usage.timestamp)
      return usageDate >= today
    }).length || 0

    const remaining = FREE_LIMIT - usageCount

    return NextResponse.json({
      limit: FREE_LIMIT,
      used: usageCount,
      remaining: Math.max(0, remaining),
      resetTime: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()
    })

  } catch (error) {
    console.error("Usage check error:", error)
    return NextResponse.json({ error: "Failed to check usage" }, { status: 500 })
  }
}
