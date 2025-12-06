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
import { UserProvider, useUser } from "@/contexts/user-context"
import { ThemeProvider } from "@/components/theme-provider"
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

function HomeContent() {
  const { user } = useUser()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentCode, setCurrentCode] = useState("")
  const [currentLanguage, setCurrentLanguage] = useState("python")
  const [isModalOpen, setIsModalOpen] = useState(false)

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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4 sm:p-8">
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
        const errorData = await response.json()
        throw new Error(errorData.error || "Analysis failed")
      }

      const data = await response.json()
      setResult(data)
    } catch (error: any) {
      console.error("[v0] Analysis error:", error)
      alert(error.message || "Analysis failed. Please check your code and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      <Header />

      {/* Usage Display Banner */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <UsageDisplay />
        </div>
      </div>

      {/* Advanced AI Agent Button */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
        <AdvancedAIButton onClick={() => setIsModalOpen(true)} hasAnalysis={!!result} />
      </div>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1">
        {/* Responsive Layout: Stack on mobile, side-by-side on desktop */}
        <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
          {/* Code Editor Section */}
          <div className="w-full lg:w-2/5 lg:flex-shrink-0">
            <CodeEditor onAnalyze={handleAnalyze} loading={loading} />
          </div>

          {/* Analysis Panel */}
          <div className="w-full lg:w-3/5 lg:flex-1">
            <Tabs defaultValue="analysis" className="w-full h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-4 bg-muted/50 border border-border rounded-lg p-1 h-auto">
                <TabsTrigger
                  value="analysis"
                  className="flex items-center justify-center gap-2 text-xs sm:text-sm py-2.5 px-2 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Zap className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Analysis</span>
                </TabsTrigger>
                <TabsTrigger
                  value="comparison"
                  className="flex items-center justify-center gap-2 text-xs sm:text-sm py-2.5 px-2 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Brain className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Compare</span>
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="flex items-center justify-center gap-2 text-xs sm:text-sm py-2.5 px-2 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <BarChart3 className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Stats</span>
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="flex items-center justify-center gap-2 text-xs sm:text-sm py-2.5 px-2 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Star className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">History</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 mt-4">
                <TabsContent value="analysis" className="h-full m-0">
                  {result ? (
                    <div className="h-full border border-border rounded-xl bg-card overflow-hidden">
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
                    </div>
                  ) : (
                    <div className="h-full min-h-[400px] flex items-center justify-center border border-dashed border-border rounded-xl bg-card/30 p-6">
                      <div className="text-center">
                        <Zap className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                        <p className="text-lg font-semibold mb-2 text-foreground">Ready to analyze</p>
                        <p className="text-sm text-muted-foreground">Paste code and click analyze to get started</p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="comparison" className="h-full m-0">
                  {result ? (
                    <div className="border border-border rounded-xl bg-card p-4 overflow-auto">
                      <CodeComparison originalCode={currentCode} optimizedCode={result.optimizedCode} />
                    </div>
                  ) : (
                    <div className="h-full min-h-[400px] flex items-center justify-center border border-dashed border-border rounded-xl bg-card/30 p-6">
                      <div className="text-center">
                        <Brain className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">Run analysis to compare code</p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="analytics" className="h-full m-0">
                  <div className="border border-border rounded-xl bg-card p-4 overflow-auto">
                    <AnalyticsDashboard />
                  </div>
                </TabsContent>

                <TabsContent value="history" className="h-full m-0">
                  <div className="border border-border rounded-xl bg-card p-4 overflow-auto">
                    <HistoryPanel onSelectHistory={(item) => console.log("Selected:", item)} />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />

      {/* Advanced AI Agent Modal */}
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

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <UserProvider>
        <HomeContent />
      </UserProvider>
    </ThemeProvider>
  )
}
