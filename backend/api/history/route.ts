import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { CodeHistory } from "@/lib/models"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const records = await CodeHistory.find().sort({ createdAt: -1 }).limit(50)
    return NextResponse.json(records)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch history" }, { status: 500 })
  }
}
