"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { ScheduleCalendar } from "@/components/scheduling/schedule-calendar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { RequestTimeOffDialog } from "@/components/scheduling/request-time-off-dialog"

export default function DoctorSchedulePage() {
  const [schedules, setSchedules] = useState([])
  const [isTimeOffOpen, setIsTimeOffOpen] = useState(false)

  const { user } = useAuth()

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!user?.id) return;
      try {
        const today = new Date().toISOString().split('T')[0]
        const res = await fetch(`/api/appointments?doctor_id=${user.id}&date=${today}`)
        if (res.ok) {
          const data = await res.json()
          // Map appointments to schedule format if needed, 
          // but for now let's just show them in the list/calendar
          setSchedules(data)
        }
      } catch (error) {
        console.error("Failed to fetch schedules:", error)
      }
    }
    fetchSchedules()
  }, [user?.id])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Schedule</h1>
          <p className="text-muted-foreground">
            Manage your availability and shifts.
          </p>
        </div>
      </div>

      <ScheduleCalendar schedules={schedules} />
    </div>
  )
}
