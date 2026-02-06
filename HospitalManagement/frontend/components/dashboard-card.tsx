"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/ui/icons"
import { useRouter } from "next/navigation"

type DashboardCardProps = {
  title: string
  value: string | number
  description: string
  icon: keyof typeof Icons
  className?: string
  href?: string
  trend?: {
    value: string
    isPositive: boolean
  }
}

export function DashboardCard({
  title,
  value,
  description,
  icon,
  className,
  href,
  trend,
}: DashboardCardProps) {
  const Icon = Icons[icon] as React.ElementType
  const router = useRouter()

  const handleClick = () => {
    if (href) {
      router.push(href)
    }
  }

  return (
    <Card
      onClick={handleClick}
      className={cn(
        "w-full transition-all duration-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:scale-[1.05] cursor-pointer hover:border-green-600 hover:bg-green-600 group relative overflow-hidden border-2",
        !href && "cursor-default",
        className
      )}
    >
      <div className="absolute top-0 right-0 -m-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-700" />
      <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-white opacity-0 group-hover:opacity-100 animate-pulse transition-opacity" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 transition-colors duration-300">
        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground group-hover:text-white transition-colors duration-300">
          {title}
        </CardTitle>
        {Icon && (
          <div className="h-6 w-6 text-muted-foreground group-hover:text-white transition-all duration-300 group-hover:scale-125">
            <Icon className="h-6 w-6" />
          </div>
        )}
      </CardHeader>
      <CardContent className="relative z-10 transition-colors duration-300">
        <div className="text-3xl font-black group-hover:text-white transition-colors duration-300">{value}</div>
        <p className="text-xs font-bold text-muted-foreground mt-1 group-hover:text-green-100 transition-colors duration-300">
          {description}
          {trend && (
            <span
              className={cn(
                "ml-1 font-black px-1.5 py-0.5 rounded-md transition-colors duration-300",
                trend.isPositive ? "bg-green-100 text-green-700 group-hover:bg-white group-hover:text-green-600" : "bg-red-100 text-red-700 group-hover:bg-red-500 group-hover:text-white"
              )}
            >
              {trend.value}
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  )
}
