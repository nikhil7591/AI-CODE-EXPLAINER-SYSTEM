"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/contexts/user-context"
import { BarChart3, Clock } from "lucide-react"

interface UsageData {
  limit: number
  used: number
  remaining: number
  resetTime: string
}

export function UsageDisplay() {
  const { user } = useUser()
  const [usage, setUsage] = useState<UsageData>({
    limit: 10,
    used: 0,
    remaining: 10,
    resetTime: new Date(new Date().setHours(24, 0, 0, 0)).toISOString(),
  })

  useEffect(() => {
    // Load usage from localStorage
    const storedUsage = localStorage.getItem("codeAnalysisUsage")
    if (storedUsage) {
      try {
        const parsed = JSON.parse(storedUsage)
        // Check if reset time has passed
        if (new Date(parsed.resetTime) < new Date()) {
          // Reset usage
          const newUsage = {
            limit: user ? 20 : 10,
            used: 0,
            remaining: user ? 20 : 10,
            resetTime: new Date(new Date().setHours(24, 0, 0, 0)).toISOString(),
          }
          localStorage.setItem("codeAnalysisUsage", JSON.stringify(newUsage))
          setUsage(newUsage)
        } else {
          setUsage(parsed)
        }
      } catch (e) {
        console.error("[v0] Failed to parse usage data")
      }
    }
  }, [user])

  const percentageUsed = (usage.used / usage.limit) * 100
  const isLow = usage.remaining <= 2

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-3">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Daily Usage</span>
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${isLow ? "text-destructive" : "text-foreground"}`}>
            {usage.used} / {usage.limit}
          </span>

          <div className="w-20 sm:w-24 bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${isLow ? "bg-destructive" : "bg-primary"}`}
              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="w-3 h-3" />
        <span>Resets at midnight</span>
      </div>
    </div>
  )
}
