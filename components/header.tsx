"use client"

import { useState } from "react"
import { Brain, Moon, Sun, Menu, X, LogOut, User, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useUser } from "@/contexts/user-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { theme, setTheme } = useTheme()
  const { user, logout } = useUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-foreground">CodeMind</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">AI Code Analysis</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-muted-foreground text-xs">{user.email}</div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="gap-2">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">Login</span>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
