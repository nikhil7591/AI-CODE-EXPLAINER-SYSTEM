"use client"

import { Github, Twitter, Linkedin, Mail, Heart, Code2, Zap, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card/50 border-t border-border/50 backdrop-blur-sm mt-12 sm:mt-16 lg:mt-20">
      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
          
          {/* Brand Section */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                <Code2 className="w-4 h-4 text-accent-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground">AI Code Explainer</h3>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Advanced AI-powered code analysis and explanation platform. Debug, optimize, and understand your code with intelligent assistance.
            </p>
            <div className="flex items-center gap-3 sm:gap-4">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground p-2">
                <Github className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground p-2">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground p-2">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground p-2">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Features Section */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Features</h4>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <a href="#" className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Zap className="w-3 h-3" />
                  Code Analysis
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Shield className="w-3 h-3" />
                  Bug Detection
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Code2 className="w-3 h-3" />
                  Code Optimization
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Heart className="w-3 h-3" />
                  AI Assistant
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Resources</h4>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Company</h4>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/50 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="text-xs sm:text-sm text-muted-foreground">
              © {currentYear} AI Code Explainer. All rights reserved.
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              Made by Nikhil Kumar
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
