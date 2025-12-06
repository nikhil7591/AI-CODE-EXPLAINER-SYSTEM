"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { Code2, Zap } from "lucide-react"

interface CodeEditorProps {
  onAnalyze: (code: string, language: string) => Promise<void>
  loading: boolean
}

export function CodeEditor({ onAnalyze, loading }: CodeEditorProps) {
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("python")

  const handleAnalyze = async () => {
    if (!code.trim()) {
      alert("Please paste some code")
      return
    }
    await onAnalyze(code, language)
  }

  return (
    <Card className="w-full h-full bg-card border border-border overflow-hidden shadow-lg flex flex-col">
      <div className="p-4 sm:p-6 flex flex-col h-full">
        {/* Header with Language Selector */}
        <div className="flex items-center gap-3 mb-4 flex-shrink-0">
          <Code2 className="w-5 h-5 text-primary flex-shrink-0" />
          <h2 className="text-lg font-semibold text-foreground">Code Input</h2>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="ml-auto px-3 py-1.5 rounded-lg bg-muted text-foreground border border-border text-sm font-medium hover:bg-muted/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={loading}
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
          </select>
        </div>

        <div className="flex-1 min-h-0 border border-border rounded-lg bg-background overflow-hidden">
          <Textarea
            placeholder="Paste your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full min-h-[250px] p-4 font-mono text-sm rounded-lg border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none bg-transparent text-foreground placeholder:text-muted-foreground/50"
            disabled={loading}
          />
        </div>

        {/* Analyze Button at Bottom */}
        <div className="mt-4 flex-shrink-0">
          <Button
            onClick={handleAnalyze}
            disabled={loading || !code.trim()}
            size="lg"
            className="w-full gap-2 items-center bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all"
          >
            {loading ? (
              <>
                <Spinner className="w-4 h-4" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Analyze Code
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  )
}
