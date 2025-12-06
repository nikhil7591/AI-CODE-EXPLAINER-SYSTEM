"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Trash2, Code2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface HistoryItem {
  id: string
  code: string
  language: string
  timestamp: Date
  bugsCount: number
}

interface HistoryPanelProps {
  onSelectHistory: (item: HistoryItem) => void
}

export function HistoryPanel({ onSelectHistory }: HistoryPanelProps) {
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    // Load history from localStorage
    const storedHistory = localStorage.getItem("codeAnalysisHistory")
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory))
      } catch (e) {
        console.error("[v0] Failed to parse history")
      }
    }
  }, [])

  const clearHistory = () => {
    localStorage.removeItem("codeAnalysisHistory")
    setHistory([])
  }

  if (history.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-8">
          <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-lg font-medium text-foreground mb-2">No history yet</p>
          <p className="text-sm text-muted-foreground">Your code analysis history will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className="text-sm font-semibold text-foreground">Analysis History</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearHistory}
          className="text-xs text-destructive hover:text-destructive"
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Clear
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {history.map((item) => (
            <Card
              key={item.id}
              className="p-3 cursor-pointer hover:bg-muted/50 transition-colors border-border"
              onClick={() => onSelectHistory(item)}
            >
              <div className="flex items-start gap-3">
                <Code2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{item.code.slice(0, 50)}...</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{item.language}</span>
                    <span className="text-xs text-muted-foreground">{item.bugsCount} bugs</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
