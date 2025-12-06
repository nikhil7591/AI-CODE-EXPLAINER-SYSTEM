"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Brain, MessageCircle, Zap, Star } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AIAssistantPanel } from "@/components/ai-assistant-panel"
import { AdvancedAIAgent } from "@/components/advanced-ai-agent"
import { FavoritesPanel } from "@/components/favorites-panel"
import { TemplatesPanel } from "@/components/templates-panel"

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full h-[90vh] max-w-5xl bg-card border-border shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-muted/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground">Advanced AI Agent</h2>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                Intelligent code analysis and assistance
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50 border border-border rounded-lg p-1 mb-4 flex-shrink-0">
              <TabsTrigger value="assistant" className="flex items-center gap-2 text-xs sm:text-sm">
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Assistant</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center gap-2 text-xs sm:text-sm">
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">AI Agent</span>
              </TabsTrigger>
              <TabsTrigger value="tools" className="flex items-center gap-2 text-xs sm:text-sm">
                <Star className="w-4 h-4" />
                <span className="hidden sm:inline">Tools</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="assistant" className="h-full m-0">
                <AIAssistantPanel code={code} language={language} analysisResult={analysisResult} />
              </TabsContent>

              <TabsContent value="ai" className="h-full m-0">
                {analysisResult ? (
                  <AdvancedAIAgent analysisId={analysisResult.id || "default"} analysisContext={analysisResult} />
                ) : (
                  <div className="h-full flex items-center justify-center border border-dashed border-border rounded-xl bg-card/30 p-8">
                    <div className="text-center">
                      <Brain className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                      <p className="text-lg font-medium text-foreground mb-2">AI Agent Ready</p>
                      <p className="text-sm text-muted-foreground">Analyze code first to enable advanced AI features</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="tools" className="h-full m-0">
                <Tabs defaultValue="favorites" className="w-full h-full flex flex-col">
                  <TabsList className="grid w-full grid-cols-2 bg-muted/30 border border-border rounded-lg mb-4 flex-shrink-0">
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
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </Card>
    </div>
  )
}
