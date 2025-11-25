import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Template } from "@/lib/models"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const searchParams = request.nextUrl.searchParams
    const language = searchParams.get("language")
    const category = searchParams.get("category")

    const query: any = {}
    if (language) query.language = language
    if (category) query.category = category

    const templates = await Template.find(query).sort({ createdAt: -1 })
    return NextResponse.json(templates)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch templates" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { title, description, category, language, code, explanation, difficulty, tags } = await request.json()

    const template = await Template.create({
      title,
      description,
      category,
      language,
      code,
      explanation,
      difficulty,
      tags,
      usageCount: 0,
    })

    return NextResponse.json(template)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create template" }, { status: 500 })
  }
}
