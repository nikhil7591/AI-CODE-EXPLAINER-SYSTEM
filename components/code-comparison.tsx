"use client"

import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CodeComparisonProps {
  originalCode: string
  optimizedCode: string
}

export function CodeComparison({ originalCode, optimizedCode }: CodeComparisonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      <Card className="p-4 border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3">Original Code</h3>
        <ScrollArea className="h-[300px]">
          <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap break-words bg-muted/50 p-4 rounded-lg text-foreground">
            {originalCode || "No code to display"}
          </pre>
        </ScrollArea>
      </Card>
      <Card className="p-4 border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3">Optimized Code</h3>
        <ScrollArea className="h-[300px]">
          <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap break-words bg-primary/10 p-4 rounded-lg text-foreground border border-primary/20">
            {optimizedCode || "No optimized code available"}
          </pre>
        </ScrollArea>
      </Card>
    </div>
  )
}
