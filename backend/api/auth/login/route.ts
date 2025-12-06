import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import mongoose from "mongoose"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    await connectDB()
    const database = mongoose.connection.getClient().db("code-explainer")
    const users = database.collection("users")

    const user = await users.findOne({ email })

    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ 
      success: true, 
      user: {
        email: user.email,
        name: user.name
      }
    })

  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
