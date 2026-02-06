"use client"

import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, Stethoscope, FileText } from "lucide-react"
import { RescheduleAppointmentDialog } from "./reschedule-appointment-dialog"
import { AddPrescriptionDialog } from "./add-prescription-dialog"
import { OrderLabTestDialog } from "./order-lab-test-dialog"

interface AppointmentDetailDialogProps {
  appointment: any
  children: React.ReactNode
  onAppointmentUpdated?: (updatedAppointment: any) => void
}

export function AppointmentDetailDialog({ appointment, children, onAppointmentUpdated }: AppointmentDetailDialogProps) {
  const [open, setOpen] = useState(false)

  const handleCancel = () => {
    const cancelled = {
      ...appointment,
      status: "cancelled",
    }
    console.log("[v0] Appointment cancelled:", cancelled)
    if (onAppointmentUpdated) {
      onAppointmentUpdated(cancelled)
    }
    setOpen(false)
  }

  const handleCheckIn = () => {
    const checkedIn = {
      ...appointment,
      status: "in-progress",
      checkedInAt: new Date().toISOString(),
    }
    console.log("[v0] Patient checked in:", checkedIn)
    if (onAppointmentUpdated) {
      onAppointmentUpdated(checkedIn)
    }
  }

  const handleComplete = () => {
    const completed = {
      ...appointment,
      status: "completed",
      completedAt: new Date().toISOString(),
    }
    console.log("[v0] Appointment completed:", completed)
    if (onAppointmentUpdated) {
      onAppointmentUpdated(completed)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
          <DialogDescription>Complete information about this appointment</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-sm">
              {appointment.type}
            </Badge>
            <Badge variant="secondary" className="text-sm">
              {appointment.status}
            </Badge>
          </div>

          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm text-muted-foreground">{appointment.date || "Today"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Time</p>
                <p className="text-sm text-muted-foreground">{appointment.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Patient</p>
                <p className="text-sm text-muted-foreground">{appointment.patient || appointment.patient_name}</p>
                {(appointment.patientId || appointment.patient_id) && (
                  <p className="text-xs text-muted-foreground font-mono">ID: {appointment.patientId || appointment.patient_id}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Doctor</p>
                <p className="text-sm text-muted-foreground">{appointment.doctor || appointment.doctor_name}</p>
              </div>
            </div>
          </div>

          {appointment.reason && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-medium">Reason for Visit</h4>
              </div>
              <p className="text-sm text-muted-foreground pl-6">{appointment.reason}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <AddPrescriptionDialog appointment={appointment} />
            <OrderLabTestDialog appointment={appointment} />
          </div>

          <div className="flex flex-col gap-2 pt-4 border-t border-border">
            {appointment.status === "scheduled" && (
              <>
                <Button variant="default" onClick={handleCheckIn} className="w-full">
                  Check In Patient
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <RescheduleAppointmentDialog
                    appointment={appointment}
                    onAppointmentRescheduled={onAppointmentUpdated}
                  />
                  <Button variant="destructive" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </>
            )}
            {appointment.status === "in-progress" && (
              <Button variant="default" onClick={handleComplete} className="w-full">
                Mark as Completed
              </Button>
            )}
            {appointment.status === "confirmed" && (
              <div className="grid grid-cols-2 gap-2">
                <RescheduleAppointmentDialog
                  appointment={appointment}
                  onAppointmentRescheduled={onAppointmentUpdated}
                />
                <Button variant="destructive" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
