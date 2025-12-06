"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Zap, TrendingUp, Bug, Clock } from "lucide-react"

interface AnalyticsData {
  overview: {
    totalAnalyses: number
    activeUsers: number
    avgAnalysisTime: string
    successRate: string
  }
  dailyStats: Array<{
    date: string
    analyses: number
    users: number
    errors: number
  }>
  languageDistribution: Array<{
    name: string
    count: number
    percentage: number
  }>
  bugAnalysis: Array<{
    category: string
    count: number
    severity: string
  }>
  performance: {
    avgAnalysisTime: number
    totalAnalyses: number
    successRate: number
    avgCodeLength: number
  }
  userActivity: {
    activeUsers: number
    newUsers: number
    returningUsers: number
    avgSessionDuration: number
  }
  trends: {
    analysesGrowth: number
    userGrowth: number
    errorRate: string
  }
}

const COLORS = ["#00D9FF", "#7C3AED", "#F24E4E", "#FFA500", "#22D3EE"]

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${API}/api/analytics`)
        const data = await response.json()
        setAnalytics(data)
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return <div className="text-center text-muted-foreground">Loading analytics...</div>
  }

  if (!analytics) {
    return <div className="text-center text-muted-foreground">No analytics data available</div>
  }

  const languageData = analytics.languageDistribution.map((lang) => ({
    name: lang.name,
    count: lang.count,
    percentage: lang.percentage,
  }))

  const bugData = analytics.bugAnalysis.map((bug, index) => ({
    name: bug.category,
    value: index + 1,
  }))

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-card/50 to-card/20 border-accent/30">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-5 h-5 text-accent" />
            <p className="text-xs text-muted-foreground">Total Analyses</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{analytics.overview.totalAnalyses}</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-card/50 to-card/20 border-accent/30">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-accent" />
            <p className="text-xs text-muted-foreground">Avg Time</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{analytics.overview.avgAnalysisTime}s</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-card/50 to-card/20 border-accent/30">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            <p className="text-xs text-muted-foreground">Success Rate</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{analytics.overview.successRate}%</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-card/50 to-card/20 border-accent/30">
          <div className="flex items-center gap-3 mb-2">
            <Bug className="w-5 h-5 text-accent" />
            <p className="text-xs text-muted-foreground">Active Users</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{analytics.overview.activeUsers}</p>
        </Card>

              </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Language Statistics */}
        <Card className="p-4 bg-card/50 border-border">
          <h3 className="text-sm font-semibold mb-4 text-foreground">Language Statistics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={languageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="count" fill="var(--accent)" name="Analyses" />
              <Bar dataKey="percentage" fill="var(--secondary)" name="Usage %" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Most Common Bugs */}
        <Card className="p-4 bg-card/50 border-border">
          <h3 className="text-sm font-semibold mb-4 text-foreground">Most Common Bugs</h3>
          <div className="space-y-3">
            {analytics.bugAnalysis.map((bug, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground truncate">{bug.category}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-destructive/10 border-destructive/30 text-destructive">
                    {bug.count}
                  </Badge>
                  <Badge variant={bug.severity === 'high' ? 'destructive' : bug.severity === 'medium' ? 'default' : 'secondary'}>
                    {bug.severity}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Detailed Language Breakdown */}
      <Card className="p-4 bg-card/50 border-border">
        <h3 className="text-sm font-semibold mb-4 text-foreground">Detailed Breakdown</h3>
        <div className="space-y-3">
          {languageData.map((lang) => (
            <div
              key={lang.name}
              className="flex items-center justify-between p-3 bg-background/50 rounded border border-border/50"
            >
              <div>
                <p className="font-medium text-foreground">{lang.name}</p>
                <p className="text-xs text-muted-foreground">{lang.count} analyses</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-accent">{lang.avgTime}ms</p>
                <p className="text-xs text-muted-foreground">avg execution</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
