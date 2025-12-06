"use client"

import { useState } from "react"
import { Brain, Github, Moon, Sun, Menu, X, BookOpen, Info, Sparkles, LogOut, User, LogIn, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useUser } from "@/contexts/user-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export function Header() {
  const { theme, setTheme } = useTheme()
  const { user, logout } = useUser()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [featuresOpen, setFeaturesOpen] = useState(false)
  const [docsOpen, setDocsOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <>
      <header className="sticky top-0 z-50 glass-effect border-b border-border/50 backdrop-blur-xl bg-background/95 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Branding */}
            <div 
              className="flex items-center gap-3 group cursor-pointer"
              onClick={() => router.push("/")}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Brain className="w-6 h-6 text-background transition-all duration-300" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  CodeMind
                </h1>
                <p className="text-xs text-muted-foreground">AI Code Analysis</p>
              </div>
            </div>

            {/* Navigation & Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <nav className="hidden md:flex items-center gap-4 lg:gap-6">
                <button
                  onClick={() => setFeaturesOpen(true)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105 relative group"
                >
                  Features
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                </button>
                <button
                  onClick={() => router.push("/docs")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105 relative group"
                >
                  Docs
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                </button>
                <button
                  onClick={() => router.push("/about")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105 relative group"
                >
                  About
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                </button>
              </nav>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 transition-transform duration-300 rotate-0" />
                ) : (
                  <Moon className="w-4 h-4 transition-transform duration-300 rotate-0" />
                )}
                <span className="hidden sm:inline text-xs">Theme</span>
              </Button>

              {/* Source Button */}
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105"
                onClick={() => window.open("https://github.com", "_blank")}
              >
                <Github className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">Source</span>
              </Button>

              {/* User Menu or Auth Buttons */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105"
                    >
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
                    <DropdownMenuItem onClick={() => router.push("/profile")} className="gap-2">
                      <UserCircle className="w-4 h-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="gap-2">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105"
                    onClick={() => router.push("/login")}
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs">Login</span>
                  </Button>
                  <Button
                    size="sm"
                    className="gap-2 bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-accent-foreground transition-all duration-300 hover:scale-105"
                    onClick={() => router.push("/signup")}
                  >
                    <span className="text-xs">Sign Up</span>
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border/50 animate-in slide-in-from-top duration-300">
              <nav className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setFeaturesOpen(true)
                    setMobileMenuOpen(false)
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left py-2"
                >
                  Features
                </button>
                <button
                  onClick={() => {
                    router.push("/docs")
                    setMobileMenuOpen(false)
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left py-2"
                >
                  Docs
                </button>
                <button
                  onClick={() => {
                    router.push("/about")
                    setMobileMenuOpen(false)
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left py-2"
                >
                  About
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Features Dialog */}
      <Dialog open={featuresOpen} onOpenChange={setFeaturesOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="w-6 h-6 text-accent" />
              Features
            </DialogTitle>
            <DialogDescription>Explore the powerful features of CodeMind AI</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>
                  AI Code Analysis
                </h3>
                <p className="text-sm text-muted-foreground pl-4">
                  Powered by Google Gemini 2.0 Flash. Get instant analysis with bug detection, explanations, suggested fixes, optimized code, and expected output.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>
                  Advanced AI Agent
                </h3>
                <p className="text-sm text-muted-foreground pl-4">
                  Multi-mode AI assistant with 4 specialized modes: Debug (find bugs), Architecture (improve structure), Security (scan vulnerabilities), and General (comprehensive analysis).
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>
                  AI Chat & Conversation
                </h3>
                <p className="text-sm text-muted-foreground pl-4">
                  Ask questions about your code, get explanations, and receive actionable suggestions. Context-aware responses based on your analysis.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>
                  Daily Usage Limits
                </h3>
                <p className="text-sm text-muted-foreground pl-4">
                  Free tier: 3 analyses per day. Track your usage with real-time counters and reset times. Perfect for learning and experimentation.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>
                  Multiple Programming Languages
                </h3>
                <p className="text-sm text-muted-foreground pl-4">
                  Support for Python, JavaScript, Java, and more. Syntax highlighting and language-specific analysis for accurate results.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>
                  Markdown-Formatted Responses
                </h3>
                <p className="text-sm text-muted-foreground pl-4">
                  Beautiful, formatted responses with bold text, lists, code blocks, and proper styling for easy reading and understanding.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>
                  User Authentication
                </h3>
                <p className="text-sm text-muted-foreground pl-4">
                  Secure login and signup with email. Track your analyses, manage usage limits, and personalize your experience.
                </p>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

    </>
  )
}
