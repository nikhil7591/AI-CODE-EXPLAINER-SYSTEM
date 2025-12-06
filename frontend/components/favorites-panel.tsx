"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Star, Trash2, Copy, Search, Heart } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

interface Favorite {
  _id: string
  code: string
  language: string
  title: string
  tags: string[]
}

export function FavoritesPanel() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${API}/api/favorites`)
        if (!response.ok) {
          throw new Error("Failed to fetch favorites")
        }
        const data = await response.json()
        setFavorites(data || [])
      } catch (error) {
        console.error("Failed to fetch favorites:", error)
        setFavorites([])
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [])

  const filteredFavorites = favorites.filter(
    (fav) =>
      fav.title?.toLowerCase().includes(search.toLowerCase()) ||
      fav.tags?.some((tag) => tag.toLowerCase().includes(search.toLowerCase())),
  )

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const deleteFavorite = async (id: string) => {
    try {
      const API = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API}/api/favorites?id=${id}`, { method: "DELETE" })
      if (response.ok) {
        setFavorites(favorites.filter((fav) => fav._id !== id))
      }
    } catch (error) {
      console.error("Failed to delete favorite:", error)
    }
  }

  return (
    <div className="space-y-4 h-full flex flex-col animate-in fade-in duration-300">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search favorites..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 bg-background/50 border-border transition-all duration-200 focus:ring-2 focus:ring-accent/50"
          />
        </div>
        <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
          <Heart className="w-5 h-5 text-accent" />
        </div>
      </div>

      <div className="flex-1 overflow-auto space-y-3 scrollbar-hide">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground animate-in fade-in duration-300">
            <Spinner className="w-6 h-6 mb-2" />
            <p className="text-sm">Loading favorites...</p>
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Star className="w-8 h-8 opacity-30" />
            </div>
            <p className="text-sm font-medium mb-1">No favorites yet</p>
            <p className="text-xs opacity-70">Save code snippets to access them here</p>
          </div>
        ) : (
          filteredFavorites.map((fav, idx) => (
            <Card
              key={fav._id}
              className="p-4 bg-card/50 border-border hover:bg-card/70 hover:border-accent/30 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="mb-3">
                <p className="font-semibold text-foreground text-sm mb-2">{fav.title || "Untitled"}</p>
                <Badge variant="outline" className="text-xs bg-primary/10 border-primary/30 text-primary">
                  {fav.language || "unknown"}
                </Badge>
              </div>

              {fav.tags && fav.tags.length > 0 && (
                <div className="flex gap-1.5 mb-3 flex-wrap">
                  {fav.tags.map((tag, tagIdx) => (
                    <Badge key={tagIdx} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <pre className="bg-background/50 rounded-lg p-3 text-xs overflow-auto max-h-24 mb-3 border border-border/50 font-mono scrollbar-hide">
                <code className="text-foreground/80">{fav.code || "No code available"}</code>
              </pre>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 flex-1 text-xs gap-1.5 bg-transparent hover:bg-accent/10 hover:border-accent/30 transition-all duration-200"
                  onClick={() => copyToClipboard(fav.code, fav._id)}
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied === fav._id ? "Copied!" : "Copy"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                  onClick={() => deleteFavorite(fav._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
