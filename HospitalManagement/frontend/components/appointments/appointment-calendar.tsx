"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const mockAppointments = [
  { date: 15, count: 3, type: "multiple" },
  { date: 18, count: 5, type: "multiple" },
  { date: 22, count: 2, type: "few" },
  { date: 25, count: 7, type: "many" },
]

export function AppointmentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1))

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    return { firstDay, daysInMonth }
  }

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i)

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const hasAppointment = (day: number) => {
    return mockAppointments.find((apt) => apt.date === day)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
          {emptyDays.map((i) => (
            <div key={`empty-${i}`} className="p-2" />
          ))}
          {days.map((day) => {
            const appointment = hasAppointment(day)
            const isToday = day === 15

            return (
              <button
                key={day}
                className={`
                  relative p-3 text-center rounded-lg transition-colors
                  ${isToday ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted"}
                  ${appointment ? "font-medium" : ""}
                `}
              >
                <span className="text-sm">{day}</span>
                {appointment && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                    {Array.from({ length: Math.min(appointment.count, 3) }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 w-1 rounded-full ${isToday ? "bg-primary-foreground" : "bg-primary"}`}
                      />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="font-medium text-sm mb-3 text-foreground">Legend</h4>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">Has Appointments</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center text-xs text-primary-foreground font-semibold">
                15
              </div>
              <span className="text-sm text-muted-foreground">Today</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
