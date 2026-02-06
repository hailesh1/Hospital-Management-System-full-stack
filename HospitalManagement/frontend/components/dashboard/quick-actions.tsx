"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, CalendarPlus, FileText, Settings } from "lucide-react"

const actions = [
  { label: "Add Patient", icon: UserPlus, href: "/admin/patients" },
  { label: "New Appointment", icon: CalendarPlus, href: "/admin/appointments" },
  { label: "Create Record", icon: FileText, href: "/admin/records" },
  { label: "System Settings", icon: Settings, href: "/admin/settings" },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="w-full justify-start gap-3 bg-transparent"
            onClick={() => (window.location.href = action.href)}
          >
            <action.icon className="h-4 w-4" />
            {action.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
