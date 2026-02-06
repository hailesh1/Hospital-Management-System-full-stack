'use client';

import { LoginForm } from "@/components/auth/login-form"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.role === 'admin' ? '/admin' : `/${user.role}/dashboard`
      router.push(redirectPath)
    }
  }, [isAuthenticated, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1e1e1e]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          <p className="text-white font-medium">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e1e1e] relative overflow-hidden">
      {/* Geometric background pattern similar to the image */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rotate-45 transform skew-x-12"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-blue-600 -rotate-12 transform skew-y-6"></div>
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-blue-400 rotate-90 transform -skew-x-6"></div>
      </div>

      <div className="z-10 w-full max-w-md flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold text-white tracking-widest">HMS</h1>
        <LoginForm />
      </div>
    </div>
  )
}
