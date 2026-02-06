"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Activity,
  Calendar,
  FileText,
  LayoutDashboard,
  Users,
  UserCog,
  Settings,
  LogOut,
  BarChart3,
  Receipt,
  CalendarClock,
  FlaskConical,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Patients", href: "/dashboard/patients", icon: Users },
  { name: "Appointments", href: "/dashboard/appointments", icon: Calendar },
  { name: "Medical Records", href: "/dashboard/records", icon: FileText },
  { name: "Lab & Prescriptions", href: "/dashboard/lab", icon: FlaskConical },
  { name: "Billing", href: "/dashboard/billing", icon: Receipt },
  { name: "Staff", href: "/dashboard/staff", icon: UserCog },
  { name: "Scheduling", href: "/dashboard/scheduling", icon: CalendarClock },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-lg text-foreground">HealthSync</h1>
            <p className="text-xs text-muted-foreground">Hospital Management</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={() => (window.location.href = "/login")}
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
