"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/contexts/user-context"
import { BarChart3, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { usageAPI } from "@/lib/api"

interface UsageData {
  limit: number
  used: number
  remaining: number
  resetTime: string
}

interface UsageDisplayProps {
  refreshTrigger?: number
}

export function UsageDisplay({ refreshTrigger }: UsageDisplayProps) {
  const { user } = useUser()
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUsage = async () => {
    if (!user) {
      // Set default usage for non-authenticated users
      const defaultUsage: UsageData = {
        limit: 3,
        used: 0,
        remaining: 3,
        resetTime: new Date(new Date().setHours(24, 0, 0, 0)).toISOString()
      }
      setUsage(defaultUsage)
      setLoading(false)
      return
    }

    try {
      const data = await usageAPI.check(user.email)
      setUsage(data)
    } catch (error) {
      console.error("Failed to fetch usage:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsage()
  }, [user])

  useEffect(() => {
    if (refreshTrigger) {
      fetchUsage()
    }
  }, [refreshTrigger])

  if (loading || !usage) {
    return null
  }

  const percentageUsed = (usage.used / usage.limit) * 100
  const isLow = usage.remaining <= 1

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-3 sm:gap-4">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium">Daily AI Usage</span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <span className={`text-sm font-medium ${isLow ? "text-destructive" : "text-foreground"}`}>
            {usage.used} / {usage.limit}
          </span>
          
          <div className="w-16 sm:w-24 bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                isLow ? "bg-destructive" : "bg-accent"
              }`}
              style={{ width: `${percentageUsed}%` }}
            />
          </div>
        </div>

        {!user && (
          <div className="text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1">
            <a href="/signup" className="hover:text-accent transition-colors">Sign up for more</a>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        {usage.remaining === 0 && (
          <div className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded px-2 sm:px-3 py-1">
            <span className="hidden sm:inline">Daily limit reached. Resets at</span>
            <span className="sm:hidden">Limit reached</span>
            <span className="hidden sm:inline"> {new Date(usage.resetTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span className="hidden sm:inline">Resets in {new Date(usage.resetTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          <span className="sm:hidden">{new Date(usage.resetTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </div>
    </div>
  )
}
