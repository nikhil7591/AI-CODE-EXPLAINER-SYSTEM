"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BookOpen, Code2, Zap, Shield, MessageCircle, BarChart3 } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background text-foreground flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-accent" />
            <h1 className="text-4xl font-bold">Documentation</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Learn how to use CodeMind AI and get the most out of our platform
          </p>
        </div>

        {/* Table of Contents */}
        <Card className="bg-card/50 border-border/50 p-6 mb-12">
          <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li><a href="#getting-started" className="hover:text-accent transition-colors">Getting Started</a></li>
            <li><a href="#ai-agent" className="hover:text-accent transition-colors">Advanced AI Agent</a></li>
            <li><a href="#analysis-results" className="hover:text-accent transition-colors">Understanding Analysis Results</a></li>
            <li><a href="#usage-limits" className="hover:text-accent transition-colors">Daily Usage Limits</a></li>
            <li><a href="#languages" className="hover:text-accent transition-colors">Supported Languages</a></li>
            <li><a href="#tips" className="hover:text-accent transition-colors">Tips & Best Practices</a></li>
            <li><a href="#faq" className="hover:text-accent transition-colors">FAQ</a></li>
          </ul>
        </Card>

        {/* Getting Started */}
        <section id="getting-started" className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-accent" />
            Getting Started
          </h2>
          <Card className="bg-card/50 border-border/50 p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Step 1: Sign Up or Login</h3>
              <p className="text-muted-foreground">Create an account with your email to get started. You'll have access to 3 free analyses per day.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Step 2: Paste Your Code</h3>
              <p className="text-muted-foreground">Copy and paste your code into the editor on the left side of the screen. The editor supports syntax highlighting for all major languages.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Step 3: Select Language</h3>
              <p className="text-muted-foreground">Choose the programming language from the dropdown menu. This helps our AI provide accurate analysis.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Step 4: Click Analyze</h3>
              <p className="text-muted-foreground">Click the "Analyze Code" button to submit your code for AI analysis. This counts as one of your daily analyses.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Step 5: Review Results</h3>
              <p className="text-muted-foreground">View your results in the tabs on the right: Explanation, Bugs, Fixes, Optimized, and Output.</p>
            </div>
          </Card>
        </section>

        {/* Advanced AI Agent */}
        <section id="ai-agent" className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-accent" />
            Advanced AI Agent
          </h2>
          <Card className="bg-card/50 border-border/50 p-6 space-y-4">
            <p className="text-muted-foreground">
              The Advanced AI Agent provides specialized analysis with 4 different modes. Each mode focuses on specific aspects of your code.
            </p>
            
            <div className="grid gap-4 mt-6">
              <div className="border border-accent/20 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2 text-accent">🔧 Debug Mode</h3>
                <p className="text-muted-foreground">Find bugs and errors in your code. Get debugging strategies and specific fixes for issues.</p>
              </div>
              
              <div className="border border-accent/20 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2 text-accent">🏗️ Architecture Mode</h3>
                <p className="text-muted-foreground">Improve code structure and design. Get suggestions for better organization and design patterns.</p>
              </div>
              
              <div className="border border-accent/20 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2 text-accent">🔒 Security Mode</h3>
                <p className="text-muted-foreground">Scan for security vulnerabilities. Identify potential exploits and get security best practices.</p>
              </div>
              
              <div className="border border-accent/20 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2 text-accent">📊 General Mode</h3>
                <p className="text-muted-foreground">Get comprehensive analysis. Receive overall suggestions and improvements for your code.</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Analysis Results */}
        <section id="analysis-results" className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-accent" />
            Understanding Analysis Results
          </h2>
          <Card className="bg-card/50 border-border/50 p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">📝 Explanation Tab</h3>
              <p className="text-muted-foreground">Detailed explanation of what your code does and how it works. Understand the logic and flow of your program.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">🐛 Bugs Tab</h3>
              <p className="text-muted-foreground">Lists all detected issues with severity levels (Low, Medium, High). Each bug includes line number and description.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">🔧 Fixes Tab</h3>
              <p className="text-muted-foreground">Specific suggestions to fix the bugs and improve your code. Actionable recommendations for each issue.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">⚡ Optimized Tab</h3>
              <p className="text-muted-foreground">An improved version of your code with optimizations applied. Shows how to write better, more efficient code.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">📤 Output Tab</h3>
              <p className="text-muted-foreground">Expected output when your code runs. Helps you understand what your program should produce.</p>
            </div>
          </Card>
        </section>

        {/* Usage Limits */}
        <section id="usage-limits" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Daily Usage Limits</h2>
          <Card className="bg-card/50 border-border/50 p-6 space-y-4">
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">Free Tier: 3 Analyses Per Day</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>✓ 3 code analyses per day</li>
                <li>✓ Access to all AI Agent modes</li>
                <li>✓ AI Chat functionality</li>
                <li>✓ Resets at midnight (24 hours)</li>
              </ul>
            </div>
            <p className="text-muted-foreground">
              The usage counter in the header shows your current usage (e.g., "2 / 3"). When you reach your limit, you'll see a message indicating when it resets.
            </p>
          </Card>
        </section>

        {/* Supported Languages */}
        <section id="languages" className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Code2 className="w-6 h-6 text-accent" />
            Supported Languages
          </h2>
          <Card className="bg-card/50 border-border/50 p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="border border-border/50 rounded-lg p-4 text-center">
                <p className="font-semibold">Python</p>
                <p className="text-xs text-muted-foreground mt-1">Full support</p>
              </div>
              <div className="border border-border/50 rounded-lg p-4 text-center">
                <p className="font-semibold">JavaScript</p>
                <p className="text-xs text-muted-foreground mt-1">Full support</p>
              </div>
              <div className="border border-border/50 rounded-lg p-4 text-center">
                <p className="font-semibold">Java</p>
                <p className="text-xs text-muted-foreground mt-1">Full support</p>
              </div>
              <div className="border border-border/50 rounded-lg p-4 text-center">
                <p className="font-semibold">TypeScript</p>
                <p className="text-xs text-muted-foreground mt-1">Full support</p>
              </div>
              <div className="border border-border/50 rounded-lg p-4 text-center">
                <p className="font-semibold">C++</p>
                <p className="text-xs text-muted-foreground mt-1">Full support</p>
              </div>
              <div className="border border-border/50 rounded-lg p-4 text-center">
                <p className="font-semibold">And More...</p>
                <p className="text-xs text-muted-foreground mt-1">Expanding</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Tips & Best Practices */}
        <section id="tips" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Tips & Best Practices</h2>
          <Card className="bg-card/50 border-border/50 p-6 space-y-3">
            <div className="flex gap-3">
              <span className="text-accent font-bold">✓</span>
              <div>
                <p className="font-semibold">Use Complete, Runnable Code</p>
                <p className="text-sm text-muted-foreground">Provide code that can be executed. Incomplete snippets may produce less accurate results.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-accent font-bold">✓</span>
              <div>
                <p className="font-semibold">Include Error Messages</p>
                <p className="text-sm text-muted-foreground">If you're debugging, include the error message. This helps the AI understand the problem better.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-accent font-bold">✓</span>
              <div>
                <p className="font-semibold">Add Comments for Context</p>
                <p className="text-sm text-muted-foreground">Comments help explain complex sections and give the AI better context for analysis.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-accent font-bold">✓</span>
              <div>
                <p className="font-semibold">Use Different Agent Modes</p>
                <p className="text-sm text-muted-foreground">Try different modes for different needs. Debug mode for bugs, Security mode for vulnerabilities, etc.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-accent font-bold">✓</span>
              <div>
                <p className="font-semibold">Ask Specific Questions</p>
                <p className="text-sm text-muted-foreground">In AI Chat, ask specific questions about your code. More specific = better answers.</p>
              </div>
            </div>
          </Card>
        </section>

        {/* FAQ */}
        <section id="faq" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <Card className="bg-card/50 border-border/50 p-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Q: How many analyses can I do per day?</h3>
              <p className="text-muted-foreground">A: Free tier users get 3 analyses per day. This resets at midnight.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Q: What happens when I reach my limit?</h3>
              <p className="text-muted-foreground">A: You'll see a message indicating your limit is reached. You can try again after midnight when it resets.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Q: Can I analyze partial code?</h3>
              <p className="text-muted-foreground">A: Yes, but complete, runnable code produces better results. Partial code may have less accurate analysis.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Q: Which languages are supported?</h3>
              <p className="text-muted-foreground">A: We support Python, JavaScript, Java, TypeScript, C++, and more. Check the Supported Languages section above.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Q: How accurate is the analysis?</h3>
              <p className="text-muted-foreground">A: Our AI provides high-quality analysis, but always review suggestions and use your judgment. It's a tool to help, not replace your expertise.</p>
            </div>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  )
}
