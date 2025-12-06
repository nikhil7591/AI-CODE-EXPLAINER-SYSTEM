import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Share } from "@/lib/models"
import crypto from "crypto"

function generateShareToken() {
  return crypto.randomBytes(16).toString("hex")
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { analysisId, expiresIn } = await request.json()

    const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 60000) : new Date(Date.now() + 7 * 24 * 60 * 60000) // Default 7 days

    const share = await Share.create({
      analysisId,
      shareToken: generateShareToken(),
      expiresAt,
    })

    return NextResponse.json({
      shareToken: share.shareToken,
      shareUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/share/${share.shareToken}`,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create share link" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get("token")

    const share = await Share.findOne({ shareToken: token })

    if (!share) {
      return NextResponse.json({ error: "Share link not found" }, { status: 404 })
    }

    if (share.expiresAt && new Date() > share.expiresAt) {
      return NextResponse.json({ error: "Share link expired" }, { status: 410 })
    }

    await Share.findByIdAndUpdate(share._id, { viewCount: share.viewCount + 1 })

    return NextResponse.json({ analysisId: share.analysisId })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch share link" }, { status: 500 })
  }
}
