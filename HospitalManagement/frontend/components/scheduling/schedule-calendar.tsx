"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ScheduleCalendar({ schedules }: { schedules: any[] }) {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  // Filter schedules for the selected date
  const selectedDateSchedules = React.useMemo(() => {
    if (!date) return []
    return schedules.filter(schedule => {
        const scheduleDate = new Date(schedule.start_time || schedule.date) // Adjust based on actual data structure
        return scheduleDate.toDateString() === date.toDateString()
    })
  }, [date, schedules])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </CardContent>
      </Card>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Shifts for {date?.toDateString()}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedDateSchedules.length === 0 ? (
              <p className="text-muted-foreground">No shifts scheduled for this day.</p>
            ) : (
              <ul className="space-y-2">
                {selectedDateSchedules.map((schedule, i) => (
                    <li key={i} className="p-2 border rounded">
                        <div className="font-medium">
                            {new Date(schedule.start_time).toLocaleTimeString()} - {new Date(schedule.end_time).toLocaleTimeString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {schedule.patient_name ? `Patient: ${schedule.patient_name}` : 'Available'}
                        </div>
                    </li>
                ))}
              </ul>
            )}
            
            {/* Debug view if empty to check data structure */}
            {selectedDateSchedules.length === 0 && schedules.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Debug: All schedules ({schedules.length})</p>
                    <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-40">
                        {JSON.stringify(schedules.slice(0, 3), null, 2)}
                    </pre>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
