"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Zap, Shield, GitBranch, MessageCircle, AlertCircle, Loader2, X, Brain, Star, BarChart3 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AIAssistantPanel } from "@/components/ai-assistant-panel"
import { AdvancedAIAgent } from "@/components/advanced-ai-agent"
import { FavoritesPanel } from "@/components/favorites-panel"
import { TemplatesPanel } from "@/components/templates-panel"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp?: Date
}

interface AdvancedAIModalProps {
  isOpen: boolean
  onClose: () => void
  code: string
  language: string
  analysisResult: any
}

export function AdvancedAIModal({ isOpen, onClose, code, language, analysisResult }: AdvancedAIModalProps) {
  const [activeTab, setActiveTab] = useState("assistant")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <Card className="w-full h-[95vh] sm:h-[90vh] max-w-4xl sm:max-w-6xl bg-card border-border shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header - Responsive */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-accent-foreground" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground">Advanced AI Agent</h2>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Intelligent code analysis and assistance</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Modal Content - Responsive */}
        <div className="flex-1 p-3 sm:p-6 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 bg-muted border border-border rounded-lg p-1 mb-4 sm:mb-6">
              <TabsTrigger value="assistant" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Assistant</span>
                <span className="sm:hidden">Asst</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">AI</span>
                <span className="sm:hidden">AI</span>
              </TabsTrigger>
              <TabsTrigger value="tools" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Tools</span>
                <span className="sm:hidden">Tools</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Contents - Responsive */}
            <div className="flex-1 overflow-hidden">
              <TabsContent value="assistant" className="h-full m-0">
                <div className="h-full">
                  <AIAssistantPanel code={code} language={language} analysisResult={analysisResult} />
                </div>
              </TabsContent>

              <TabsContent value="ai" className="h-full m-0">
                <div className="h-full">
                  {analysisResult ? (
                    <AdvancedAIAgent analysisId={analysisResult.id} analysisContext={analysisResult} />
                  ) : (
                    <div className="h-full flex items-center justify-center border border-dashed border-border rounded-xl bg-card/30 p-4 sm:p-8">
                      <div className="text-center">
                        <Brain className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-muted-foreground/50" />
                        <p className="text-base sm:text-lg font-medium text-foreground mb-2">AI Agent Ready</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Analyze code first to enable advanced AI features</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="tools" className="h-full m-0">
                <div className="h-full">
                  <Tabs defaultValue="favorites" className="w-full h-full flex flex-col">
                    <TabsList className="grid w-full grid-cols-2 bg-background/50 border border-border/50 rounded-lg mb-3 sm:mb-4">
                      <TabsTrigger value="favorites" className="text-xs sm:text-sm">
                        Favorites
                      </TabsTrigger>
                      <TabsTrigger value="templates" className="text-xs sm:text-sm">
                        Templates
                      </TabsTrigger>
                    </TabsList>

                    <div className="flex-1 overflow-hidden">
                      <TabsContent value="favorites" className="h-full m-0">
                        <FavoritesPanel />
                      </TabsContent>
                      <TabsContent value="templates" className="h-full m-0">
                        <TemplatesPanel />
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </Card>
    </div>
  )
}
