"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Zap, Shield, GitBranch, MessageCircle, AlertCircle, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import ReactMarkdown from "react-markdown"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp?: Date
}

interface AdvancedAIAgentProps {
  analysisId: string
  analysisContext?: any
}

export function AdvancedAIAgent({ analysisId, analysisContext }: AdvancedAIAgentProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [agentMode, setAgentMode] = useState<"debug" | "architecture" | "security" | "general">("general")
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue("")
    setLoading(true)
    setError(null)

    try {
      const systemContext = {
        mode: agentMode,
        analysis: analysisContext,
        conversationHistory: messages,
      }

      const response = await fetch("/api/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId,
          userMessage: currentInput,
          analysisContext: systemContext,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message || "I couldn't generate a response. Please try again.",
          timestamp: new Date(),
        },
      ])
    } catch (error: any) {
      console.error("Failed to send message:", error)
      setError(error.message || "Failed to send message. Please try again.")
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, I encountered an error: ${error.message || "Please try again later."}`,
          timestamp: new Date(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickPrompts = {
    debug: "Help me debug the errors in this code",
    architecture: "Suggest architecture improvements for this code",
    security: "Analyze potential security vulnerabilities",
    general: "Explain this code in detail",
  }

  const modeIcons = {
    debug: Zap,
    architecture: GitBranch,
    security: Shield,
    general: MessageCircle,
  }

  const modeColors = {
    debug: "from-yellow-500/20 to-orange-500/20",
    architecture: "from-blue-500/20 to-cyan-500/20",
    security: "from-red-500/20 to-pink-500/20",
    general: "from-accent/20 to-primary/20",
  }

  const modeDescriptions = {
    debug: {
      title: "Debug Mode",
      description: "Find and fix bugs in your code",
      details: "• Identifies runtime errors and bugs\n• Explains what's wrong\n• Provides specific fixes\n• Suggests debugging strategies",
      usage: "Ask: 'Help me debug this' or 'Why is this failing?'"
    },
    architecture: {
      title: "Architecture Mode",
      description: "Improve code structure and design",
      details: "• Reviews code organization\n• Suggests design patterns\n• Improves scalability\n• Enhances maintainability",
      usage: "Ask: 'How can I improve the structure?' or 'What design pattern fits here?'"
    },
    security: {
      title: "Security Mode",
      description: "Scan for security vulnerabilities",
      details: "• Finds security issues\n• Identifies potential exploits\n• Checks data protection\n• Validates input handling",
      usage: "Ask: 'Are there security issues?' or 'How can I make this secure?'"
    },
    general: {
      title: "General Mode",
      description: "Get comprehensive code analysis",
      details: "• Explains what code does\n• Suggests improvements\n• Follows best practices\n• Provides general guidance",
      usage: "Ask: 'Explain this code' or 'How can I improve this?'"
    },
  }

  const tabDescriptions = {
    assistant: {
      title: "Assistant Tab",
      description: "Chat with AI about your code",
      details: "General-purpose AI chat for asking questions and getting help with your code analysis."
    },
    ai: {
      title: "AI Tab",
      description: "Core analysis engine",
      details: "Powers all analysis features. Select a mode above to get specialized analysis."
    },
    tools: {
      title: "Tools Tab",
      description: "Utility functions",
      details: "Helper tools for specific code analysis tasks and utilities."
    },
  }

  return (
    <div className="flex flex-col h-full max-h-[60vh]">
      {/* Header with info */}
      <div className="bg-gradient-to-r from-accent/10 to-primary/10 p-3 rounded-lg mb-3 border border-accent/20 flex-shrink-0">
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <p className="text-xs font-bold text-foreground mb-1">🤖 Advanced AI Agent</p>
            <p className="text-xs text-muted-foreground">
              Select a mode below to analyze your code with specialized focus. Each mode provides targeted insights for debugging, architecture, security, or general analysis.
            </p>
          </div>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="flex gap-2 overflow-x-auto pb-3 flex-shrink-0">
        {(["debug", "architecture", "security", "general"] as const).map((mode) => {
          const Icon = modeIcons[mode]
          const isActive = agentMode === mode
          return (
            <Button
              key={mode}
              size="sm"
              variant={isActive ? "default" : "outline"}
              className={`text-xs whitespace-nowrap ${
                isActive ? "bg-gradient-to-r from-accent to-primary text-accent-foreground" : ""
              }`}
              onClick={() => {
                setAgentMode(mode)
                setError(null)
              }}
              title={`${modeDescriptions[mode].title}: ${modeDescriptions[mode].description}`}
            >
              <Icon className="w-3 h-3 mr-1.5" />
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </Button>
          )
        })}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 mb-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive flex-shrink-0">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Chat Area - Scrollable */}
      <ScrollArea className="flex-1 min-h-0 rounded-lg border border-border bg-background/30 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-8 space-y-4">
              <div
                className={`w-16 h-16 rounded-full bg-gradient-to-br ${modeColors[agentMode]} flex items-center justify-center mb-2`}
              >
                {(() => {
                  const Icon = modeIcons[agentMode]
                  return <Icon className="w-8 h-8 text-accent" />
                })()}
              </div>
              
              {/* Mode Information */}
              <div className="max-w-sm space-y-3">
                <div>
                  <p className="text-sm font-bold text-foreground mb-1">
                    {modeDescriptions[agentMode].title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {modeDescriptions[agentMode].description}
                  </p>
                </div>
                
                {/* What this mode does */}
                <div className="bg-muted/50 p-3 rounded-lg border border-border/50 text-left">
                  <p className="text-xs font-semibold text-foreground mb-2">What it does:</p>
                  <p className="text-xs text-muted-foreground whitespace-pre-line">
                    {modeDescriptions[agentMode].details}
                  </p>
                </div>
                
                {/* How to use */}
                <div className="bg-accent/10 p-3 rounded-lg border border-accent/20 text-left">
                  <p className="text-xs font-semibold text-accent mb-2">How to use:</p>
                  <p className="text-xs text-foreground">
                    {modeDescriptions[agentMode].usage}
                  </p>
                </div>
                
                {/* Suggested prompt */}
                <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                  <p className="text-xs text-muted-foreground mb-1">Try this:</p>
                  <p className="text-sm text-foreground font-medium italic">"{quickPrompts[agentMode]}"</p>
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <Card
                  className={`max-w-[85%] p-4 shadow-sm ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-accent to-accent/80 text-accent-foreground border-none"
                      : "bg-card border-border text-foreground"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="text-sm break-words leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          h1: ({...props}: any) => <h1 className="text-lg font-bold mt-3 mb-2" {...props} />,
                          h2: ({...props}: any) => <h2 className="text-base font-bold mt-2 mb-1.5" {...props} />,
                          h3: ({...props}: any) => <h3 className="text-sm font-bold mt-2 mb-1" {...props} />,
                          p: ({...props}: any) => <p className="mb-2" {...props} />,
                          ul: ({...props}: any) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                          ol: ({...props}: any) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                          li: ({...props}: any) => <li className="ml-2" {...props} />,
                          code: ({inline, ...props}: any) => 
                            inline ? (
                              <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono" {...props} />
                            ) : (
                              <code className="block bg-muted p-2 rounded text-xs font-mono overflow-x-auto mb-2" {...props} />
                            ),
                          blockquote: ({...props}: any) => <blockquote className="border-l-4 border-accent pl-3 italic my-2" {...props} />,
                          strong: ({...props}: any) => <strong className="font-bold text-accent" {...props} />,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{msg.content}</p>
                  )}
                  {msg.timestamp && (
                    <p className="text-xs opacity-60 mt-2">
                      {new Date(msg.timestamp).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  )}
                </Card>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <Card className="bg-muted border-border p-3 flex gap-2 items-center">
                <Spinner className="w-4 h-4" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </Card>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area - Fixed at Bottom */}
      <div className="space-y-2 flex-shrink-0 pt-3">
        {messages.length === 0 && (
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <MessageCircle className="w-3 h-3" />
            <span>Suggested: {quickPrompts[agentMode]}</span>
          </div>
        )}
        <div className="flex gap-2">
          <Input
            placeholder={`Ask the AI agent in ${agentMode} mode...`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="bg-background/50 h-10 border-border"
          />
          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={loading || !inputValue.trim()}
            className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-accent-foreground px-4 h-10"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
        {analysisContext && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="text-xs">
              Context: {analysisContext.bugsDetected?.length || 0} issues found
            </Badge>
          </div>
        )}
      </div>
    </div>
  )
}
