"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export function RegisterForm() {
  const { register, isLoading } = useAuth()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (!firstName || !lastName || !email || !password) {
      toast.error("Please fill in all fields")
      return
    }

    // In a real app, this would call an API to register the user.
    // In dev mode, we pass the data to our context helper.
    register(undefined, {
      name: `${firstName} ${lastName}`,
      email: email,
      role: 'patient'
    })
    
    toast.success("Registration successful", {
      description: "Welcome to the Patient Portal"
    })
  }

  return (
    <Card className="w-full border-t-4 border-t-blue-600 rounded-none shadow-2xl bg-white">
      <CardHeader className="pt-8 pb-4 px-8">
        <CardTitle className="text-3xl font-normal text-gray-800">Create an account</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pb-8 px-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="firstName" className="text-sm font-semibold text-gray-700">First Name</label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full h-11 border border-gray-300 rounded-none focus-visible:ring-1 focus-visible:ring-blue-600 bg-white"
                placeholder="John"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="lastName" className="text-sm font-semibold text-gray-700">Last Name</label>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-11 border border-gray-300 rounded-none focus-visible:ring-1 focus-visible:ring-blue-600 bg-white"
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 border border-gray-300 rounded-none focus-visible:ring-1 focus-visible:ring-blue-600 bg-white"
              placeholder="john.doe@example.com"
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
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" title="Confirm Password" className="text-sm font-semibold text-gray-700">Confirm Password</label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-11 border border-gray-300 rounded-none focus-visible:ring-1 focus-visible:ring-blue-600 bg-white pr-10"
                placeholder="••••••"
              />
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
              "Register"
            )}
          </Button>

          <div className="text-center pt-4">
            <span className="text-sm text-gray-600">Already have an account? </span>
            <Link href="/login" className="text-sm text-blue-600 hover:underline">
              Sign In
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
