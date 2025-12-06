import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import mongoose from "mongoose"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    await connectDB()
    const database = mongoose.connection.getClient().db("code-explainer")
    const users = database.collection("users")

    // Check if user already exists
    const existingUser = await users.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Create new user
    const newUser = {
      name,
      email,
      password, // In production, you should hash this
      createdAt: new Date(),
      data: {
        analyses: [],
        favorites: [],
        history: []
      }
    }

    await users.insertOne(newUser)

    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({ 
      success: true, 
      user: {
        email: newUser.email,
        name: newUser.name
      }
    })

  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Signup failed" }, { status: 500 })
  }
}
