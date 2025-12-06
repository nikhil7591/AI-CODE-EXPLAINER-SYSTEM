import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Favorite } from "@/lib/models"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { analysisId, code, language, title, tags } = await request.json()

    const favorite = await Favorite.create({
      analysisId,
      code,
      language,
      title: title || "Untitled",
      tags: tags || [],
      isFavorited: true,
    })

    return NextResponse.json(favorite)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to add favorite" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const favorites = await Favorite.find({ isFavorited: true }).sort({ createdAt: -1 })
    return NextResponse.json(favorites)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch favorites" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB()
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    await Favorite.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete favorite" }, { status: 500 })
  }
}
