"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Code2, Sparkles } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

interface Template {
  id: string
  title: string
  description: string
  category: string
  language: string
  code: string
  explanation: string
  difficulty: "beginner" | "intermediate" | "advanced"
  tags: string[]
}

const CATEGORIES = ["algorithms", "data-structures", "patterns", "utilities"]
const LANGUAGES = ["python", "javascript", "java"]

export function TemplatesPanel() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("algorithms")
  const [selectedLanguage, setSelectedLanguage] = useState("python")
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true)
      try {
        const API = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${API}/api/templates?category=${selectedCategory}&language=${selectedLanguage}`)
        if (!response.ok) {
          throw new Error("Failed to fetch templates")
        }
        const data = await response.json()
        setTemplates(data || [])
      } catch (error) {
        console.error("Failed to fetch templates:", error)
        setTemplates([])
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [selectedCategory, selectedLanguage])

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-accent/10 text-accent border-accent/30"
      case "intermediate":
        return "bg-secondary/10 text-secondary border-secondary/30"
      case "advanced":
        return "bg-destructive/10 text-destructive border-destructive/30"
      default:
        return "bg-primary/10 text-primary border-primary/30"
    }
  }

  return (
    <div className="space-y-4 h-full flex flex-col animate-in fade-in duration-300">
      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            Category
          </p>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-background/50 h-9 border border-border backdrop-blur-sm">
              {CATEGORIES.slice(0, 2).map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="text-xs transition-all duration-200 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">Language</p>
          <div className="flex gap-2">
            {LANGUAGES.map((lang) => (
              <Button
                key={lang}
                size="sm"
                variant={selectedLanguage === lang ? "default" : "outline"}
                className="text-xs h-9 flex-1 transition-all duration-200 hover:scale-105"
                onClick={() => setSelectedLanguage(lang)}
              >
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto space-y-3 scrollbar-hide">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground animate-in fade-in duration-300">
            <Spinner className="w-6 h-6 mb-2" />
            <p className="text-sm">Loading templates...</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Code2 className="w-8 h-8 opacity-30" />
            </div>
            <p className="text-sm font-medium mb-1">No templates found</p>
            <p className="text-xs opacity-70">Try selecting a different category or language</p>
          </div>
        ) : (
          templates.map((template, idx) => (
            <Card
              key={template.id}
              className="p-4 bg-card/50 border-border hover:bg-card/70 hover:border-accent/30 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="mb-3">
                <p className="font-semibold text-foreground text-sm mb-1">{template.title || "Untitled Template"}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{template.description || "No description"}</p>
              </div>

              <div className="flex gap-2 mb-3">
                <Badge variant="outline" className={`text-xs ${getDifficultyColor(template.difficulty)}`}>
                  {template.difficulty || "unknown"}
                </Badge>
                {template.tags && template.tags.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {template.tags[0]}
                  </Badge>
                )}
              </div>

              <pre className="bg-background/50 rounded-lg p-3 text-xs overflow-auto max-h-24 mb-3 border border-border/50 font-mono scrollbar-hide">
                <code className="text-foreground/80">{template.code || "No code available"}</code>
              </pre>

              <Button
                size="sm"
                className="w-full h-9 text-xs gap-2 bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-accent-foreground transition-all duration-200 hover:scale-105"
                onClick={() => copyToClipboard(template.code, template.id)}
              >
                <Copy className="w-3.5 h-3.5" />
                {copied === template.id ? "Copied!" : "Use Template"}
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
