import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import mongoose from "mongoose"

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

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ data: userWithoutPassword.data || { analyses: [], favorites: [], history: [] } })

  } catch (error) {
    console.error("Get user data error:", error)
    return NextResponse.json({ error: "Failed to get user data" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { email, data } = await request.json()

    if (!email || !data) {
      return NextResponse.json({ error: "Email and data are required" }, { status: 400 })
    }

    await connectDB()
    const database = mongoose.connection.getClient().db("code-explainer")
    const users = database.collection("users")

    const result = await users.updateOne(
      { email },
      { $set: { data, updatedAt: new Date() } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("Update user data error:", error)
    return NextResponse.json({ error: "Failed to update user data" }, { status: 500 })
  }
}
