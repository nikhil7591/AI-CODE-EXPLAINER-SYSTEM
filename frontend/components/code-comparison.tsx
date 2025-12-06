"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Copy, Download } from "lucide-react"

interface ComparisonProps {
  originalCode: string
  optimizedCode: string
  improvements?: {
    performanceGain: string
    readabilityScore: number
    complexityReduction: string
  }
}

export function CodeComparison({ originalCode, optimizedCode, improvements }: ComparisonProps) {
  const [copied, setCopied] = useState<"original" | "optimized" | null>(null)

  const copyToClipboard = (text: string, type: "original" | "optimized") => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-4">
      {improvements && (
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-gradient-to-br from-card to-card/80 p-4 border-accent/30">
            <p className="text-xs text-muted-foreground mb-1">Performance Gain</p>
            <p className="text-lg font-bold text-accent">{improvements.performanceGain}</p>
          </Card>
          <Card className="bg-gradient-to-br from-card to-card/80 p-4 border-accent/30">
            <p className="text-xs text-muted-foreground mb-1">Readability</p>
            <p className="text-lg font-bold text-accent">{improvements.readabilityScore}%</p>
          </Card>
          <Card className="bg-gradient-to-br from-card to-card/80 p-4 border-accent/30">
            <p className="text-xs text-muted-foreground mb-1">Complexity</p>
            <p className="text-lg font-bold text-accent">{improvements.complexityReduction}</p>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* Original Code */}
        <Card className="p-4 bg-card/50 border-border overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
              Original
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyToClipboard(originalCode, "original")}
              className="h-8 w-8 p-0"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <pre className="bg-background/50 rounded p-3 text-xs overflow-auto flex-1 border border-border/50">
            <code>{originalCode}</code>
          </pre>
        </Card>

        {/* Arrow */}
        <div className="flex items-center justify-center">
          <ArrowRight className="w-8 h-8 text-accent" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Empty Space */}
        <div />

        {/* Optimized Code */}
        <Card className="p-4 bg-card/50 border-border overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
              Optimized
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyToClipboard(optimizedCode, "optimized")}
              className="h-8 w-8 p-0"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <pre className="bg-background/50 rounded p-3 text-xs overflow-auto flex-1 border border-border/50">
            <code>{optimizedCode}</code>
          </pre>
        </Card>
      </div>

      {/* Comparison Stats */}
      <Card className="p-4 bg-gradient-to-br from-accent/5 to-transparent border-accent/20">
        <h4 className="text-sm font-semibold mb-2 text-foreground">Key Changes</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-accent mt-0.5">•</span>
            <span>Improved code organization and readability</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-0.5">•</span>
            <span>Enhanced performance with optimized algorithms</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-0.5">•</span>
            <span>Better error handling and edge case coverage</span>
          </li>
        </ul>
      </Card>

      <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
        <Download className="w-4 h-4" />
        Export Comparison
      </Button>
    </div>
  )
}
