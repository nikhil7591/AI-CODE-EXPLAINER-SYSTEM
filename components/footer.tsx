"use client"

import { Code2 } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card/50 border-t border-border/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Code2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground">CodeMind</span>
          </div>
          <p className="text-xs text-muted-foreground">{currentYear} CodeMind. AI-powered code analysis.</p>
        </div>
      </div>
    </footer>
  )
}
