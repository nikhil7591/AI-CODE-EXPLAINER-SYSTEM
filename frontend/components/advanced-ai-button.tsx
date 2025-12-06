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
      className="w-full bg-gradient-to-r from-accent via-primary to-accent hover:from-accent/90 hover:via-primary/90 hover:to-accent/90 text-accent-foreground font-medium shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-0 text-sm sm:text-base py-3 sm:py-4"
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative">
          <Brain className="w-4 h-4 sm:w-5 sm:h-5" />
          <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 absolute -top-1 -right-1 text-yellow-300" />
        </div>
        <span className="truncate">Advanced AI Agent</span>
        {hasAnalysis && (
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs ml-auto">
            <span className="hidden sm:inline">Active</span>
            <span className="sm:hidden">●</span>
          </Badge>
        )}
      </div>
    </Button>
  )
}
