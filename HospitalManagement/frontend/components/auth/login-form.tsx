"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export function LoginForm() {
  const { login, forgotPassword, isLoading } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a standard OIDC flow, we redirect to Keycloak.
    // We can pass the username as a hint to Keycloak.
    login({ loginHint: username })
  }

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault()
    forgotPassword()
  }

  return (
    <Card className="w-full border-t-4 border-t-blue-600 rounded-none shadow-2xl bg-white">
      <CardHeader className="pt-8 pb-4 px-8">
        <CardTitle className="text-3xl font-normal text-gray-800">Sign in to your account</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pb-8 px-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label htmlFor="username" className="text-sm font-semibold text-gray-700">Username or email</label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-11 border border-gray-300 rounded-none focus-visible:ring-1 focus-visible:ring-blue-600 bg-white"
              placeholder="admin"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" title="Password" className="text-sm font-semibold text-gray-700">Password</label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 border border-gray-300 rounded-none focus-visible:ring-1 focus-visible:ring-blue-600 bg-white pr-10"
                placeholder="••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <div className="pt-1">
              <button type="button" onClick={handleForgotPassword} className="text-sm text-blue-600 hover:underline">Forgot Password?</button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-[#0062ac] hover:bg-[#005291] text-white rounded-none text-lg font-medium transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Wait...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <div className="text-center pt-4">
            <span className="text-sm text-gray-600">New user? </span>
            <Link href="/register" className="text-sm text-blue-600 hover:underline">Register</Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
