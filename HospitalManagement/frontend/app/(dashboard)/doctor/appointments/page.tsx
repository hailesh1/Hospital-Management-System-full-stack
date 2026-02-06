"use client"

import { useEffect, useState } from "react"
import { AppointmentsList } from "@/components/appointments/appointments-list"
import { CreateAppointmentDialog } from "@/components/appointments/create-appointment-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Appointment } from "@/types"

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    const loadedAppointments = JSON.parse(localStorage.getItem("appointments") || "[]")
    setAppointments(loadedAppointments)
  }, [])

  const handleAppointmentAdded = (newAppointment: Appointment) => {
    const updatedAppointments = [...appointments, newAppointment]
    setAppointments(updatedAppointments)
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments))
  }

  const handleUpdateAppointment = (updated: any) => {
    const updatedList = appointments.map((a: any) => a.id === updated.id ? updated : a)
    setAppointments(updatedList)
    localStorage.setItem("appointments", JSON.stringify(updatedList))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">
            Manage your daily appointments.
          </p>
        </div>
        <CreateAppointmentDialog
          onAddAppointment={handleAppointmentAdded}
        />
      </div>

      <AppointmentsList
        appointments={appointments}
        onViewAll={() => console.log("View all clicked")}
        onAppointmentUpdated={handleUpdateAppointment}
      />
    </div>
  )
}
