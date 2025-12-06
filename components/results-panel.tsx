"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, AlertTriangle, Zap, Bug, Wrench, Terminal } from "lucide-react"
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
        return "bg-destructive/20 text-destructive border-destructive/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="w-full h-full flex flex-col">
      <Tabs defaultValue="explanation" className="w-full h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-5 bg-muted/50 border-b border-border rounded-none p-0 h-12 flex-shrink-0">
          <TabsTrigger
            value="explanation"
            className="text-xs sm:text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent bg-transparent h-full"
          >
            <Zap className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Explain</span>
          </TabsTrigger>
          <TabsTrigger
            value="bugs"
            className="text-xs sm:text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent bg-transparent h-full"
          >
            <Bug className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Bugs ({bugs.length})</span>
            <span className="sm:hidden">{bugs.length}</span>
          </TabsTrigger>
          <TabsTrigger
            value="fixes"
            className="text-xs sm:text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent bg-transparent h-full"
          >
            <Wrench className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Fixes</span>
          </TabsTrigger>
          <TabsTrigger
            value="optimized"
            className="text-xs sm:text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent bg-transparent h-full"
          >
            <CheckCircle className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Optimized</span>
          </TabsTrigger>
          <TabsTrigger
            value="execution"
            className="text-xs sm:text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent bg-transparent h-full"
          >
            <Terminal className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Output</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 min-h-0 overflow-hidden">
          <TabsContent value="explanation" className="h-full m-0 data-[state=inactive]:hidden">
            <ScrollArea className="h-full max-h-[400px]">
              <div className="p-4 sm:p-6">
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">{explanation}</p>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="bugs" className="h-full m-0 data-[state=inactive]:hidden">
            <ScrollArea className="h-full max-h-[400px]">
              <div className="p-4 sm:p-6">
                {bugs.length === 0 ? (
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <p className="text-sm text-foreground">No bugs detected! Great code!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bugs.map((bug, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-lg border border-border bg-card hover:bg-card/80 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{bug.issue}</p>
                            {bug.line > 0 && <p className="text-xs text-muted-foreground mt-1">Line {bug.line}</p>}
                          </div>
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium border flex-shrink-0 ${getSeverityColor(bug.severity)}`}
                          >
                            {bug.severity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="fixes" className="h-full m-0 data-[state=inactive]:hidden">
            <ScrollArea className="h-full max-h-[400px]">
              <div className="p-4 sm:p-6">
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">{suggestedFixes}</p>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="optimized" className="h-full m-0 data-[state=inactive]:hidden">
            <ScrollArea className="h-full max-h-[400px]">
              <div className="p-4 sm:p-6">
                <pre className="font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto whitespace-pre-wrap break-words bg-muted/50 p-4 rounded-lg text-foreground border border-border">
                  {optimizedCode}
                </pre>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="execution" className="h-full m-0 data-[state=inactive]:hidden">
            <ScrollArea className="h-full max-h-[400px]">
              <div className="p-4 sm:p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-foreground">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Output
                  </h3>
                  <pre className="text-xs sm:text-sm bg-muted/50 p-4 rounded-lg overflow-x-auto text-foreground font-mono border border-border">
                    {output || "(no output)"}
                  </pre>
                </div>
                {error && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-destructive">
                      <AlertTriangle className="w-4 h-4" />
                      Error
                    </h3>
                    <pre className="text-xs sm:text-sm bg-destructive/10 p-4 rounded-lg text-destructive overflow-x-auto font-mono border border-destructive/30">
                      {error}
                    </pre>
                    {errorExplanation && (
                      <p className="text-xs text-muted-foreground mt-2 whitespace-pre-wrap">{errorExplanation}</p>
                    )}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">Execution time: {executionTime}ms</p>
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
