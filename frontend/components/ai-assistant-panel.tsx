"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { MessageCircle, Send, Lightbulb, AlertCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface AnalysisResult {
  explanation?: string
  bugsDetected?: Array<{ issue: string; severity: string }>
  error?: string
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AIAssistantPanelProps {
  code: string
  language: string
  analysisResult: AnalysisResult | null
}

export function AIAssistantPanel({ code, language, analysisResult }: AIAssistantPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your AI code assistant. Analyze some code to get started, then ask me anything about it.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) {
      return
    }

    if (!code || code.trim().length === 0) {
      const errorMessage: Message = {
        id: Math.random().toString(),
        role: "assistant",
        content:
          "Please analyze some code first before asking questions. Paste your code in the editor and click 'Analyze Code'.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      return
    }

    const userMessage: Message = {
      id: Math.random().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = input
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentInput,
          code,
          language,
          analysisResult: {
            explanation: analysisResult?.explanation,
            bugs: analysisResult?.bugsDetected,
            error: analysisResult?.error,
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: Math.random().toString(),
        role: "assistant",
        content: data.response || "I couldn't generate a response. Please try again.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error: any) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: Math.random().toString(),
        role: "assistant",
        content: `Sorry, I encountered an error: ${error.message || "Please try again later."}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
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

  const suggestedQuestions = [
    "What does this code do?",
    "How can I optimize this?",
    "Explain the bugs found",
    "What's the time complexity?",
  ]

  const hasCode = code && code.trim().length > 0

  return (
    <Card className="w-full h-full flex flex-col bg-card border border-border overflow-hidden shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 flex-shrink-0">
        <MessageCircle className="w-5 h-5 text-accent" />
        <h2 className="text-lg font-semibold text-foreground">Code Assistant</h2>
        {language && (
          <Badge variant="secondary" className="ml-auto text-xs">
            {language}
          </Badge>
        )}
      </div>

      {/* Messages Area - Scrollable */}
      <ScrollArea className="flex-1 min-h-0 p-4 bg-background/50">
        <div className="space-y-4" ref={scrollRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] px-4 py-3 rounded-lg text-sm leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-br-none"
                    : "bg-muted text-foreground rounded-bl-none border border-border/50"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                <p className="text-xs opacity-70 mt-2">
                  {new Date(msg.timestamp).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground px-4 py-3 rounded-lg rounded-bl-none flex gap-2 items-center border border-border/50 shadow-sm">
                <Spinner className="w-4 h-4" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick suggestions */}
      {!hasCode && messages.length <= 1 && (
        <div className="px-4 py-3 border-t border-border bg-muted/30 flex-shrink-0">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground mb-1">Get Started</p>
              <p className="text-xs text-muted-foreground">
                Analyze code first to enable chat. Paste your code in the editor and click "Analyze Code".
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Suggested Questions */}
      {hasCode && messages.length <= 1 && (
        <div className="px-4 py-3 border-t border-border bg-muted/20 flex-shrink-0">
          <p className="text-xs font-medium text-muted-foreground mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                className="text-xs h-7 bg-transparent"
                onClick={() => setInput(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input - Fixed at Bottom */}
      <div className="p-3 border-t border-border bg-card/50 flex-shrink-0">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={hasCode ? "Ask about the code..." : "Analyze code first to chat"}
            disabled={loading || !hasCode}
            className="flex-1 bg-input text-foreground placeholder:text-muted-foreground border-border text-sm"
          />
          <Button
            onClick={handleSendMessage}
            disabled={loading || !hasCode || !input.trim()}
            size="sm"
            className="gap-1"
          >
            {loading ? <Spinner className="w-4 h-4" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
        {!hasCode && (
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <AlertCircle className="w-3 h-3" />
            <span>Code analysis required to enable chat</span>
          </div>
        )}
      </div>
    </Card>
  )
}
