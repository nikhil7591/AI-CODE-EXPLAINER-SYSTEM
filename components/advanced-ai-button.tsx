"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Sparkles } from "lucide-react"

interface AdvancedAIButtonProps {
  onClick: () => void
  hasAnalysis: boolean
}

export function AdvancedAIButton({ onClick, hasAnalysis }: AdvancedAIButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg transition-all duration-300 hover:shadow-xl text-sm sm:text-base py-3"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Brain className="w-5 h-5" />
          <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300" />
        </div>
        <span>Advanced AI Agent</span>
        {hasAnalysis && (
          <Badge
            variant="secondary"
            className="bg-background/20 text-primary-foreground border-background/30 text-xs ml-auto"
          >
            Active
          </Badge>
        )}
      </div>
    </Button>
  )
}
