import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { CodeHistory } from "@/lib/models"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const analyses = await CodeHistory.find().sort({ createdAt: -1 })

    const languageStats = {
      python: { count: 0, avgTime: 0, totalTime: 0 },
      javascript: { count: 0, avgTime: 0, totalTime: 0 },
      java: { count: 0, avgTime: 0, totalTime: 0 },
    }

    const bugFrequency: { [key: string]: number } = {}

    analyses.forEach((analysis: any) => {
      const lang = analysis.language as keyof typeof languageStats
      if (languageStats[lang]) {
        languageStats[lang].count += 1
        languageStats[lang].totalTime += analysis.executionTime || 0
      }

      analysis.bugsDetected?.forEach((bug: any) => {
        bugFrequency[bug.issue] = (bugFrequency[bug.issue] || 0) + 1
      })
    })

    Object.keys(languageStats).forEach((lang) => {
      if (languageStats[lang as keyof typeof languageStats].count > 0) {
        languageStats[lang as keyof typeof languageStats].avgTime = Math.round(
          languageStats[lang as keyof typeof languageStats].totalTime /
            languageStats[lang as keyof typeof languageStats].count,
        )
      }
    })

    const mostCommonBugs = Object.entries(bugFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([bug]) => bug)

    const analytics = {
      totalAnalyses: analyses.length,
      totalExecutionTime: Object.values(languageStats).reduce((sum, stat) => sum + stat.totalTime, 0),
      languageStats,
      mostCommonBugs,
      averageExecutionTime:
        analyses.length > 0
          ? Math.round(Object.values(languageStats).reduce((sum, stat) => sum + stat.totalTime, 0) / analyses.length)
          : 0,
    }

    return NextResponse.json(analytics)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch analytics" }, { status: 500 })
  }
}
