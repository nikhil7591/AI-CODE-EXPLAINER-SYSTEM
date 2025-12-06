"use client"

import { Card } from "@/components/ui/card"
import { BarChart3, Zap, Bug, Clock } from "lucide-react"

export function AnalyticsDashboard() {
  // Mock analytics data
  const stats = {
    totalAnalyses: 0,
    bugsFound: 0,
    avgExecutionTime: 0,
    topLanguage: "N/A",
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Your Analytics</h3>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.totalAnalyses}</p>
              <p className="text-xs text-muted-foreground">Total Analyses</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <Bug className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.bugsFound}</p>
              <p className="text-xs text-muted-foreground">Bugs Found</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.avgExecutionTime}ms</p>
              <p className="text-xs text-muted-foreground">Avg Time</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{stats.topLanguage}</p>
              <p className="text-xs text-muted-foreground">Top Language</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 border-border">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">Analytics will populate as you analyze more code</p>
        </div>
      </Card>
    </div>
  )
}
