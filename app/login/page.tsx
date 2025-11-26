"use client"

import { useRouter } from "next/navigation"
import { AuthForm } from "@/components/auth-form"
import { useUser } from "@/contexts/user-context"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useUser()

  const handleAuthSuccess = (user: { email: string; name: string }) => {
    // Store user data and redirect
    localStorage.setItem("user", JSON.stringify({
      id: "1",
      name: user.name,
      email: user.email
    }))
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background text-foreground flex items-center justify-center p-8">
      <AuthForm onAuthSuccess={handleAuthSuccess} />
    </div>
  )
}
