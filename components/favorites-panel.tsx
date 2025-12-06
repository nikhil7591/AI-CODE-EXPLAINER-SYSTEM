"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Star, Code2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function FavoritesPanel() {
  const [favorites, setFavorites] = useState<any[]>([])

  useEffect(() => {
    const storedFavorites = localStorage.getItem("codeFavorites")
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites))
      } catch (e) {
        console.error("[v0] Failed to parse favorites")
      }
    }
  }, [])

  if (favorites.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-8">
          <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-lg font-medium text-foreground mb-2">No favorites yet</p>
          <p className="text-sm text-muted-foreground">Save your favorite code snippets here</p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-2 p-1">
        {favorites.map((item, idx) => (
          <Card key={idx} className="p-3 border-border hover:bg-muted/50 cursor-pointer transition-colors">
            <div className="flex items-start gap-3">
              <Code2 className="w-4 h-4 text-primary mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{item.name || "Untitled"}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.language}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}
