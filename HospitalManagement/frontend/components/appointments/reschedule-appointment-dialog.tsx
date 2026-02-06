"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarClock } from "lucide-react"

interface RescheduleAppointmentDialogProps {
  appointment: any
  onAppointmentRescheduled?: (rescheduled: any) => void
}

export function RescheduleAppointmentDialog({
  appointment,
  onAppointmentRescheduled,
}: RescheduleAppointmentDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    date: "",
    time: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const rescheduled = {
      ...appointment,
      date: formData.date,
      time: formData.time,
      status: "scheduled",
    }

    console.log("[v0] Appointment rescheduled:", rescheduled)

    if (onAppointmentRescheduled) {
      onAppointmentRescheduled(rescheduled)
    }

    setOpen(false)
    setFormData({ date: "", time: "" })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CalendarClock className="h-4 w-4 mr-2" />
          Reschedule
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reschedule Appointment</DialogTitle>
          <DialogDescription>Select a new date and time for this appointment</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">New Date *</Label>
            <Input
              id="date"
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">New Time *</Label>
            <Input
              id="time"
              type="time"
              required
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium mb-1">Current Appointment</p>
            <p className="text-xs text-muted-foreground">Patient: {appointment.patient}</p>
            <p className="text-xs text-muted-foreground">
              Current Time: {appointment.time} on {appointment.date || "Today"}
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Confirm Reschedule</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
