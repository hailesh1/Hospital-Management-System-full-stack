"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Stethoscope, Heart, Shield, Users, Loader2 } from "lucide-react"

export function StaffStats() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/dashboard/stats')
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Error fetching staff stats:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statItems = [
    {
      title: "Doctors",
      value: stats?.doctors || "0",
      icon: Stethoscope,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Nurses",
      value: stats?.nurses || "0",
      icon: Heart,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-500/10",
    },
    {
      title: "Admin Staff",
      value: stats?.admin || "0",
      icon: Shield,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      title: "Support Staff",
      value: stats?.support || "0",
      icon: Users,
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-500/10",
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat) => (
        <Card key={stat.title} className="transition-all duration-500 hover:shadow-2xl hover:scale-[1.05] cursor-pointer hover:border-green-600 hover:bg-green-600 group border-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 -m-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-700" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-black uppercase tracking-widest text-muted-foreground group-hover:text-white transition-colors duration-300">{stat.title}</p>
                <p className="text-2xl font-black text-foreground group-hover:text-white transition-colors duration-300">{stat.value}</p>
              </div>
              <div className={`h-12 w-12 rounded-xl ${stat.bg} flex items-center justify-center group-hover:bg-white transition-all duration-500`}>
                <stat.icon className={`h-6 w-6 ${stat.color} group-hover:text-green-600 transition-all group-hover:scale-125`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
