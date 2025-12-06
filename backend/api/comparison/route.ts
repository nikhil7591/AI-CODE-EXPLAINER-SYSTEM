import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Comparison } from "@/lib/models"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { originalAnalysisId, optimizedAnalysisId, originalCode, optimizedCode, improvements } = await request.json()

    const comparison = await Comparison.create({
      originalAnalysisId,
      optimizedAnalysisId,
      originalCode,
      optimizedCode,
      improvements,
    })

    return NextResponse.json(comparison)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create comparison" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const searchParams = request.nextUrl.searchParams
    const analysisId = searchParams.get("analysisId")

    const comparisons = await Comparison.findOne({
      $or: [{ originalAnalysisId: analysisId }, { optimizedAnalysisId: analysisId }],
    }).sort({ createdAt: -1 })

    return NextResponse.json(comparisons || {})
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch comparison" }, { status: 500 })
  }
}
