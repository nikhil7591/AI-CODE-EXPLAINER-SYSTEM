"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Info, Heart, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background text-foreground flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Info className="w-8 h-8 text-accent" />
            <h1 className="text-4xl font-bold">About CodeMind AI</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Learn more about our AI-powered code analysis platform
          </p>
        </div>

        {/* Main Description */}
        <Card className="bg-card/50 border-border/50 p-8 mb-12">
          <p className="text-lg text-muted-foreground leading-relaxed">
            CodeMind AI is an intelligent code analysis platform that helps developers understand, debug, optimize, and improve their code. 
            With advanced AI-powered insights and recommendations, we make code analysis accessible and actionable for developers of all levels.
          </p>
        </Card>

        {/* Mission */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Heart className="w-7 h-7 text-accent" />
            Our Mission
          </h2>
          <Card className="bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20 p-8">
            <p className="text-lg text-muted-foreground leading-relaxed">
              To empower developers with intelligent tools that make code analysis simple, accessible, and educational. 
              We believe that understanding code is the foundation of writing better code. Our goal is to democratize access to 
              advanced code analysis, making it available to developers everywhere, regardless of their experience level.
            </p>
          </Card>
        </section>

        {/* Key Features */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Zap className="w-7 h-7 text-accent" />
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-card/50 border-border/50 p-6">
              <h3 className="font-semibold text-lg mb-2">Advanced Code Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Intelligent analysis with bug detection, explanations, and optimization suggestions
              </p>
            </Card>
            <Card className="bg-card/50 border-border/50 p-6">
              <h3 className="font-semibold text-lg mb-2">Multi-Mode AI Agent</h3>
              <p className="text-sm text-muted-foreground">
                Debug, Architecture, Security, and General modes for specialized analysis
              </p>
            </Card>
            <Card className="bg-card/50 border-border/50 p-6">
              <h3 className="font-semibold text-lg mb-2">Interactive AI Chat</h3>
              <p className="text-sm text-muted-foreground">
                Ask questions about your code and get context-aware responses
              </p>
            </Card>
            <Card className="bg-card/50 border-border/50 p-6">
              <h3 className="font-semibold text-lg mb-2">Multi-Language Support</h3>
              <p className="text-sm text-muted-foreground">
                Support for Python, JavaScript, Java, TypeScript, C++, and more
              </p>
            </Card>
            <Card className="bg-card/50 border-border/50 p-6">
              <h3 className="font-semibold text-lg mb-2">Beautiful Responses</h3>
              <p className="text-sm text-muted-foreground">
                Markdown-formatted responses with proper styling for easy reading
              </p>
            </Card>
            <Card className="bg-card/50 border-border/50 p-6">
              <h3 className="font-semibold text-lg mb-2">Usage Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Daily limits and real-time usage counters for free tier users
              </p>
            </Card>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/50 border-border/50 p-6">
              <h3 className="font-semibold text-lg mb-4 text-accent">Frontend</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Next.js 16</li>
                <li>✓ React 19</li>
                <li>✓ TypeScript</li>
                <li>✓ Tailwind CSS</li>
                <li>✓ shadcn/ui Components</li>
              </ul>
            </Card>
            <Card className="bg-card/50 border-border/50 p-6">
              <h3 className="font-semibold text-lg mb-4 text-accent">Backend</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Express.js</li>
                <li>✓ Node.js</li>
                <li>✓ MongoDB</li>
                <li>✓ Nodemon (Development)</li>
                <li>✓ CORS & Security</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Meet the Team */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Founder */}
            <Card className="bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20 p-8 text-center">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg">
                <span className="text-6xl">👨‍💼</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Nikhil</h3>
              <p className="text-accent font-semibold mb-4">Founder & Lead Developer</p>
              <p className="text-muted-foreground leading-relaxed">
                Full-stack developer with a passion for AI and code analysis. Nikhil designed and built CodeMind AI from the ground up, 
                combining his expertise in web development with cutting-edge AI technology to create a platform that helps developers worldwide.
              </p>
              <div className="mt-6 pt-6 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  Dedicated to making code analysis accessible to all developers
                </p>
              </div>
            </Card>

            {/* Development Team */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 p-8 text-center">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <span className="text-6xl">👨‍💻</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Development Team</h3>
              <p className="text-primary font-semibold mb-4">Contributors & Collaborators</p>
              <p className="text-muted-foreground leading-relaxed">
                A dedicated team of developers working tirelessly to improve CodeMind AI and bring new features to life. 
                Our team is committed to delivering quality code, innovative features, and exceptional user experience for developers worldwide.
              </p>
              <div className="mt-6 pt-6 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  Building the future of code analysis, one feature at a time
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Why CodeMind AI */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Why CodeMind AI?</h2>
          <div className="space-y-4">
            <Card className="bg-card/50 border-border/50 p-6">
              <h3 className="font-semibold text-lg mb-2">🎯 Focused on Developers</h3>
              <p className="text-muted-foreground">
                Built by developers, for developers. We understand the challenges you face and create solutions that actually help.
              </p>
            </Card>
            <Card className="bg-card/50 border-border/50 p-6">
              <h3 className="font-semibold text-lg mb-2">🚀 Powered by Advanced AI</h3>
              <p className="text-muted-foreground">
                Leveraging state-of-the-art AI technology to provide accurate, intelligent, and actionable code analysis.
              </p>
            </Card>
            <Card className="bg-card/50 border-border/50 p-6">
              <h3 className="font-semibold text-lg mb-2">💡 Educational Value</h3>
              <p className="text-muted-foreground">
                Learn best practices, improve your coding skills, and understand code better with detailed explanations and suggestions.
              </p>
            </Card>
            <Card className="bg-card/50 border-border/50 p-6">
              <h3 className="font-semibold text-lg mb-2">🎁 Free to Start</h3>
              <p className="text-muted-foreground">
                Get started for free with 3 analyses per day. No credit card required. Perfect for learning and experimentation.
              </p>
            </Card>
          </div>
        </section>

        {/* Vision */}
        <section className="mb-12">
          <Card className="bg-gradient-to-r from-accent/20 to-primary/20 border-accent/30 p-8">
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We envision a world where every developer has access to intelligent code analysis tools that help them write better, 
              more secure, and more efficient code. CodeMind AI is our step towards making that vision a reality. 
              We're committed to continuous improvement, innovation, and providing exceptional value to our users.
            </p>
          </Card>
        </section>

        {/* Footer Message */}
        <div className="text-center pt-8 border-t border-border/50">
          <p className="text-muted-foreground mb-2">
            © 2025 CodeMind AI. Built with <Heart className="w-4 h-4 text-red-500 inline" /> for developers worldwide.
          </p>
          <p className="text-xs text-muted-foreground">
            Join thousands of developers using CodeMind AI to improve their code every day.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
