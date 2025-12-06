"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Zap, Shield, GitBranch, MessageCircle, AlertCircle, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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
        throw new Error(errorData.error || `Request failed: ${response.status}`)
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
      console.error("[v0] Failed to send message:", error)
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
    general: "from-primary/20 to-muted/20",
  }

  return (
    <div className="flex flex-col h-full max-h-[500px] gap-3">
      {/* Mode Selection */}
      <div className="flex gap-2 overflow-x-auto pb-2 flex-shrink-0">
        {(["debug", "architecture", "security", "general"] as const).map((mode) => {
          const Icon = modeIcons[mode]
          const isActive = agentMode === mode
          return (
            <Button
              key={mode}
              size="sm"
              variant={isActive ? "default" : "outline"}
              className={`text-xs whitespace-nowrap flex-shrink-0 ${
                isActive ? "bg-primary text-primary-foreground" : ""
              }`}
              onClick={() => {
                setAgentMode(mode)
                setError(null)
              }}
            >
              <Icon className="w-3 h-3 mr-1.5" />
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </Button>
          )
        })}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive flex-shrink-0">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-xs">{error}</span>
        </div>
      )}

      {/* Chat Area */}
      <ScrollArea className="flex-1 min-h-0 rounded-lg border border-border bg-background/50 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-8">
              <div
                className={`w-16 h-16 rounded-full bg-gradient-to-br ${modeColors[agentMode]} flex items-center justify-center mb-4`}
              >
                {(() => {
                  const Icon = modeIcons[agentMode]
                  return <Icon className="w-8 h-8 text-foreground" />
                })()}
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                {agentMode.charAt(0).toUpperCase() + agentMode.slice(1)} Mode Active
              </p>
              <p className="text-xs text-muted-foreground mb-4">Start a conversation with the AI agent</p>
              <div className="bg-muted/50 p-3 rounded-lg border border-border max-w-sm">
                <p className="text-xs text-muted-foreground mb-1">Suggested prompt:</p>
                <p className="text-sm text-foreground font-medium">{quickPrompts[agentMode]}</p>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <Card
                  className={`max-w-[85%] p-3 shadow-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground border-none"
                      : "bg-card border-border text-foreground"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{msg.content}</p>
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
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </Card>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="space-y-2 flex-shrink-0">
        <div className="flex gap-2">
          <Input
            placeholder={`Ask the AI agent in ${agentMode} mode...`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="bg-background h-10 border-border"
          />
          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={loading || !inputValue.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 h-10"
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
