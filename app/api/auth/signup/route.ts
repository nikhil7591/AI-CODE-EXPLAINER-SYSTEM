import { NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const client = new MongoClient(uri)

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    await client.connect()
    const database = client.db("AI-code-explainer") // Use the correct database name from .env.local
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
  } finally {
    await client.close()
  }
}
