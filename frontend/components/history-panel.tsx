"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Clock, Code2, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface HistoryItem {
  id: string
  originalCode: string
  language: string
  createdAt: string
  bugsDetected: Array<{ line: number; issue: string; severity: string }>
  explanation?: string
  optimizedCode?: string
  output?: string
  error?: string
  errorExplanation?: string
  executionTime?: number
}

interface HistoryPanelProps {
  onSelectHistory: (item: HistoryItem) => void
}

export function HistoryPanel({ onSelectHistory }: HistoryPanelProps) {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const API = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API}/api/history`)
      if (!response.ok) {
        throw new Error("Failed to fetch history")
      }
      const data = await response.json()
      setHistory(data || [])
    } catch (error) {
      console.error("Failed to fetch history:", error)
      setHistory([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diff = now.getTime() - date.getTime()
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)

      if (minutes < 1) return "Just now"
      if (minutes < 60) return `${minutes}m ago`
      if (hours < 24) return `${hours}h ago`
      if (days < 7) return `${days}d ago`
      return date.toLocaleDateString()
    } catch {
      return "Recently"
    }
  }

  if (loading) {
    return (
      <Card className="p-6 flex items-center justify-center bg-card border border-border animate-in fade-in duration-300">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="w-6 h-6" />
          <p className="text-xs text-muted-foreground">Loading history...</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-card border border-border overflow-auto max-h-full animate-in fade-in duration-300">
      <div className="p-4 border-b border-border sticky top-0 bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm z-10 flex items-center gap-2">
        <Clock className="w-5 h-5 text-accent" />
        <h2 className="text-sm font-semibold text-foreground">Recent Analyses</h2>
        {history.length > 0 && (
          <Badge variant="secondary" className="ml-auto text-xs">
            {history.length}
          </Badge>
        )}
      </div>

      <div className="space-y-2 p-4">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 opacity-30" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">No history yet</p>
            <p className="text-xs text-muted-foreground">Your code analyses will appear here</p>
          </div>
        ) : (
          history.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => onSelectHistory(item)}
              className="w-full text-left p-3 rounded-lg border border-border bg-background/50 hover:bg-muted/50 hover:border-accent/50 transition-all duration-200 group animate-in fade-in slide-in-from-bottom-2 hover:scale-[1.02]"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0 flex items-start gap-2">
                  <div className="p-1.5 rounded-md bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <Code2 className="w-4 h-4 text-accent flex-shrink-0" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-mono text-foreground truncate group-hover:text-accent transition-colors mb-1">
                      {item.originalCode?.split("\n")[0]?.substring(0, 50) || "Code snippet"}
                      {item.originalCode?.split("\n")[0]?.length > 50 && "..."}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs capitalize">
                        {item.language || "unknown"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                {item.bugsDetected && item.bugsDetected.length > 0 && (
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge
                      variant="destructive"
                      className="text-xs font-medium flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {item.bugsDetected.length}
                    </Badge>
                  </div>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </Card>
  )
}
