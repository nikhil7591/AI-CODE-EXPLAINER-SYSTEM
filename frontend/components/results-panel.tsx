"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, AlertTriangle, Zap } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ResultsPanelProps {
  explanation: string
  bugs: { line: number; issue: string; severity: "low" | "medium" | "high" }[]
  suggestedFixes: string
  optimizedCode: string
  output: string
  error: string
  errorExplanation: string
  executionTime: number
}

export function ResultsPanel({
  explanation,
  bugs,
  suggestedFixes,
  optimizedCode,
  output,
  error,
  errorExplanation,
  executionTime,
}: ResultsPanelProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-destructive/20 text-destructive"
      case "medium":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
      case "low":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-400"
      default:
        return ""
    }
  }

  return (
    <div className="w-full h-full flex flex-col min-h-0 overflow-hidden">
      <Tabs defaultValue="explanation" className="w-full h-full flex flex-col min-h-0">
        <TabsList className="grid w-full grid-cols-5 bg-muted/50 border-b border-border rounded-none p-0 h-auto flex-shrink-0">
          <TabsTrigger
            value="explanation"
            className="text-xs sm:text-sm rounded-none data-[state=active]:border-b-2 data-[state=active]:border-accent bg-transparent px-3 py-2"
          >
            <span className="hidden sm:inline">Explanation</span>
            <Zap className="w-4 h-4 sm:hidden" />
          </TabsTrigger>
          <TabsTrigger
            value="bugs"
            className="text-xs sm:text-sm rounded-none data-[state=active]:border-b-2 data-[state=active]:border-accent bg-transparent px-3 py-2"
          >
            <span className="hidden sm:inline">Bugs ({bugs.length})</span>
            <span className="sm:hidden">Bugs</span>
          </TabsTrigger>
          <TabsTrigger
            value="fixes"
            className="text-xs sm:text-sm rounded-none data-[state=active]:border-b-2 data-[state=active]:border-accent bg-transparent px-3 py-2"
          >
            <span className="hidden sm:inline">Fixes</span>
            <CheckCircle className="w-4 h-4 sm:hidden" />
          </TabsTrigger>
          <TabsTrigger
            value="optimized"
            className="text-xs sm:text-sm rounded-none data-[state=active]:border-b-2 data-[state=active]:border-accent bg-transparent px-3 py-2"
          >
            <span className="hidden sm:inline">Optimized</span>
            <Zap className="w-4 h-4 sm:hidden" />
          </TabsTrigger>
          <TabsTrigger
            value="execution"
            className="text-xs sm:text-sm rounded-none data-[state=active]:border-b-2 data-[state=active]:border-accent bg-transparent px-3 py-2"
          >
            <span className="hidden sm:inline">Output</span>
            <AlertTriangle className="w-4 h-4 sm:hidden" />
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 min-h-0 overflow-hidden">
          <TabsContent value="explanation" className="h-full m-0 p-0 data-[state=inactive]:hidden">
            <ScrollArea className="h-full">
              <Card className="border-0 rounded-none bg-background text-foreground p-6">
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">{explanation}</p>
              </Card>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="bugs" className="h-full m-0 p-0 data-[state=inactive]:hidden">
            <ScrollArea className="h-full">
              <Card className="border-0 rounded-none bg-background text-foreground p-6">
                {bugs.length === 0 ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <p className="text-sm">No bugs detected! Great code!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bugs.map((bug, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card/80 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-foreground">{bug.issue}</p>
                            {bug.line > 0 && <p className="text-xs text-muted-foreground mt-1">Line {bug.line}</p>}
                          </div>
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 ${getSeverityColor(bug.severity)}`}
                          >
                            {bug.severity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="fixes" className="h-full m-0 p-0 data-[state=inactive]:hidden">
            <ScrollArea className="h-full">
              <Card className="border-0 rounded-none bg-background text-foreground p-6">
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">{suggestedFixes}</p>
              </Card>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="optimized" className="h-full m-0 p-0 data-[state=inactive]:hidden">
            <ScrollArea className="h-full">
              <Card className="border-0 rounded-none bg-background text-foreground p-6">
                <pre className="font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap break-words bg-muted/30 p-4 rounded-lg text-muted-foreground">
                  {optimizedCode}
                </pre>
              </Card>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="execution" className="h-full m-0 p-0 data-[state=inactive]:hidden">
            <ScrollArea className="h-full">
              <Card className="border-0 rounded-none bg-background text-foreground p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      Output
                    </h3>
                    <pre className="text-xs bg-muted/30 p-3 rounded-lg overflow-x-auto text-muted-foreground font-mono">
                      {output || "(no output)"}
                    </pre>
                  </div>
                  {error && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-destructive">
                        <AlertTriangle className="w-4 h-4" />
                        Error
                      </h3>
                      <pre className="text-xs bg-destructive/10 p-3 rounded-lg text-destructive/80 overflow-x-auto font-mono border border-destructive/30">
                        {error}
                      </pre>
                      {errorExplanation && (
                        <p className="text-xs text-muted-foreground mt-2 whitespace-pre-wrap">{errorExplanation}</p>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">Execution time: {executionTime}ms</p>
                </div>
              </Card>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
