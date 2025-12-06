"use client"

import { useUser } from "@/contexts/user-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserCircle, Mail, Calendar, BarChart3 } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ProfilePage() {
  const { user } = useUser()

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Please log in to view your profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background text-foreground flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 lg:px-8 py-8 w-full">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* User Info Card */}
            <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                  <UserCircle className="w-8 h-8 text-background" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-muted-foreground text-sm">Member since today</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Joined: {new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Usage: 3 / 3 daily analyses</span>
                </div>
              </div>
            </Card>

            {/* Settings Card */}
            <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4">Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Notifications</span>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Privacy Settings</span>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Account Security</span>
                  <Button variant="outline" size="sm">Update</Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Stats Overview */}
          <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Your Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">0</div>
                <div className="text-sm text-muted-foreground">Total Analyses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">0</div>
                <div className="text-sm text-muted-foreground">Bugs Fixed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">0</div>
                <div className="text-sm text-muted-foreground">Optimizations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">3</div>
                <div className="text-sm text-muted-foreground">Daily Limit</div>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
