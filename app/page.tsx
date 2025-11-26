"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CodeEditor } from "@/components/code-editor"
import { ResultsPanel } from "@/components/results-panel"
import { HistoryPanel } from "@/components/history-panel"
import { AIAssistantPanel } from "@/components/ai-assistant-panel"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { UsageDisplay } from "@/components/usage-display"
import { AdvancedAIModal } from "@/components/advanced-ai-modal"
import { AdvancedAIButton } from "@/components/advanced-ai-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeComparison } from "@/components/code-comparison"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { FavoritesPanel } from "@/components/favorites-panel"
import { TemplatesPanel } from "@/components/templates-panel"
import { ExportSharePanel } from "@/components/export-share-panel"
import { AuthForm } from "@/components/auth-form"
import { useUser } from "@/contexts/user-context"
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
  const router = useRouter()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentCode, setCurrentCode] = useState("")
  const [currentLanguage, setCurrentLanguage] = useState("python")
  const [showComparison, setShowComparison] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAuthSuccess = (userData: { email: string; name: string }) => {
    // Store user data and refresh page
    localStorage.setItem("user", JSON.stringify({
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email
    }))
    window.location.reload()
  }

  // Show auth form if user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background text-foreground flex items-center justify-center p-8">
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
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm mt-2">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8 py-3">
          <UsageDisplay />
        </div>
      </div>

      {/* Advanced AI Agent Button */}
      <div className="max-w-[1920px] mx-auto px-4 lg:px-8 mt-6">
        <AdvancedAIButton 
          onClick={() => setIsModalOpen(true)} 
          hasAnalysis={!!result} 
        />
      </div>

      <main className="max-w-[1920px] mx-auto px-4 lg:px-8 py-6 lg:py-8 flex-1 w-full">
        {/* Responsive Layout: Mobile Stack | Desktop Side-by-Side */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 h-auto lg:h-[calc(100vh-280px)]">
          
          {/* Code Editor Section - Full width on mobile, 40% on desktop */}
          <div className="w-full lg:w-[40%] lg:flex-shrink-0">
            <CodeEditor onAnalyze={handleAnalyze} loading={loading} />
          </div>

          {/* Analysis Panel - Full width on mobile, 60% on desktop */}
          <div className="w-full lg:w-[60%] lg:flex-1">
            <Tabs defaultValue="analysis" className="w-full h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-muted border border-border rounded-lg p-1 mb-3">
                <TabsTrigger value="analysis" className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-1 sm:px-2 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">Analysis</span>
                </TabsTrigger>
                <TabsTrigger value="comparison" className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-1 sm:px-2 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <Brain className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">Compare</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-1 sm:px-2 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">Stats</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-1 sm:px-2 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">History</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-hidden pt-4">
                <TabsContent value="analysis" className="h-full mt-0">
                  {result ? (
                    <div className="h-full overflow-y-auto p-4">
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
                    <div className="h-full flex items-center justify-center border border-dashed border-border rounded-xl bg-card/30 p-4 lg:p-6">
                      <div className="text-center">
                        <Zap className="w-8 h-8 lg:w-12 lg:h-12 mx-auto mb-4 text-accent/50" />
                        <p className="text-base lg:text-lg font-semibold mb-2 text-foreground">Ready to analyze</p>
                        <p className="text-xs lg:text-sm text-muted-foreground">Paste code and click analyze to get started</p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="comparison" className="h-full mt-0">
                  <div className="h-full overflow-y-auto p-4">
                    {result ? (
                      <CodeComparison originalCode={currentCode} optimizedCode={result.optimizedCode} />
                    ) : (
                      <div className="h-full flex items-center justify-center border border-dashed border-border rounded-xl bg-card/30 p-4 lg:p-6">
                        <div className="text-center">
                          <Brain className="w-8 h-8 lg:w-12 lg:h-12 mx-auto mb-4 text-accent/50" />
                          <p className="text-xs lg:text-sm text-muted-foreground">Run analysis to compare code</p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="h-full mt-0">
                  <div className="h-full overflow-y-auto p-4">
                    <AnalyticsDashboard />
                  </div>
                </TabsContent>

                <TabsContent value="history" className="h-full mt-0">
                  <div className="h-full overflow-y-auto p-4">
                    <HistoryPanel onSelectHistory={(item) => console.log("Selected:", item)} />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Footer */}
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