"use client"

import { useState } from "react"
import { CodeEditor } from "@/components/code-editor"
import { ResultsPanel } from "@/components/results-panel"
import { HistoryPanel } from "@/components/history-panel"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { UsageDisplay } from "@/components/usage-display"
import { AdvancedAIModal } from "@/components/advanced-ai-modal"
import { AdvancedAIButton } from "@/components/advanced-ai-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeComparison } from "@/components/code-comparison"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { AuthForm } from "@/components/auth-form"
import { useUser } from "@/contexts/user-context"
import { usageAPI } from "@/lib/api"
import { Zap, BarChart3, Star, Brain } from "lucide-react"

interface AnalysisResult {
  id: string
  explanation: string
  bugsDetected: Array<{
    line: number
    issue: string
    severity: "low" | "medium" | "high"
  }>
  suggestedFixes: string
  optimizedCode: string
  output: string
  error: string
  errorExplanation: string
  executionTime: number
}

export default function Home() {
  const { user } = useUser()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentCode, setCurrentCode] = useState("")
  const [currentLanguage, setCurrentLanguage] = useState("python")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [usageRefreshTrigger, setUsageRefreshTrigger] = useState(0)

  const handleAuthSuccess = (userData: { email: string; name: string }) => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
      }),
    )
    window.location.reload()
  }

  // Show auth form if user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background text-foreground flex items-center justify-center p-4 sm:p-8">
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      </div>
    )
  }

  const handleAnalyze = async (code: string, language: string) => {
    setCurrentCode(code)
    setCurrentLanguage(language)
    setLoading(true)
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      })

      if (!response.ok) {
        throw new Error("Analysis failed")
      }

      const data = await response.json()
      setResult(data)

      // Record usage after successful analysis
      if (user?.email) {
        try {
          await usageAPI.record(user.email)
          // Trigger usage display refresh without page reload
          setUsageRefreshTrigger(prev => prev + 1)
        } catch (usageError) {
          console.error("Failed to record usage:", usageError)
          // Don't show error to user, just log it
        }
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Analysis failed. Please check your code and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background text-foreground flex flex-col">
      <Header />

      {/* Usage Display Banner */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <UsageDisplay refreshTrigger={usageRefreshTrigger} />
        </div>
      </div>

      {/* Advanced AI Agent Button */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <AdvancedAIButton onClick={() => setIsModalOpen(true)} hasAnalysis={!!result} />
      </div>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1">
        {/* Responsive Layout */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Code Editor Section */}
          <div className="w-full lg:w-2/5 lg:flex-shrink-0">
            <CodeEditor onAnalyze={handleAnalyze} loading={loading} />
          </div>

          {/* Analysis Panel */}
          <div className="w-full lg:w-3/5">
            <Tabs defaultValue="analysis" className="w-full h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-muted border border-border rounded-lg p-1 mb-4">
                <TabsTrigger
                  value="analysis"
                  className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">Analysis</span>
                </TabsTrigger>
                <TabsTrigger
                  value="comparison"
                  className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Brain className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">Compare</span>
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">Stats</span>
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">History</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex-1">
                <TabsContent value="analysis" className="mt-0">
                  {result ? (
                    <ResultsPanel
                      explanation={result.explanation}
                      bugs={result.bugsDetected}
                      suggestedFixes={result.suggestedFixes}
                      optimizedCode={result.optimizedCode}
                      output={result.output}
                      error={result.error}
                      errorExplanation={result.errorExplanation}
                      executionTime={result.executionTime}
                    />
                  ) : (
                    <div className="flex items-center justify-center border border-dashed border-border rounded-xl bg-card/30 p-8 min-h-[300px]">
                      <div className="text-center">
                        <Zap className="w-10 h-10 mx-auto mb-4 text-accent/50" />
                        <p className="text-base font-semibold mb-2 text-foreground">Ready to analyze</p>
                        <p className="text-sm text-muted-foreground">Paste code and click analyze to get started</p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="comparison" className="mt-0">
                  {result ? (
                    <CodeComparison originalCode={currentCode} optimizedCode={result.optimizedCode} />
                  ) : (
                    <div className="flex items-center justify-center border border-dashed border-border rounded-xl bg-card/30 p-8 min-h-[300px]">
                      <div className="text-center">
                        <Brain className="w-10 h-10 mx-auto mb-4 text-accent/50" />
                        <p className="text-sm text-muted-foreground">Run analysis to compare code</p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="analytics" className="mt-0">
                  <AnalyticsDashboard />
                </TabsContent>

                <TabsContent value="history" className="mt-0">
                  <HistoryPanel onSelectHistory={(item) => console.log("Selected:", item)} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />

      <AdvancedAIModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        code={currentCode}
        language={currentLanguage}
        analysisResult={result}
      />
    </div>
  )
}
