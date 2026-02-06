"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppointmentDetailDialog } from "./appointment-detail-dialog"

const statusColors = {
  confirmed: "bg-green-500/10 text-green-700 dark:text-green-400",
  scheduled: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  completed: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
  cancelled: "bg-red-500/10 text-red-700 dark:text-red-400",
  "in-progress": "bg-orange-500/10 text-orange-700 dark:text-orange-400",
}

const typeColors = {
  Checkup: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  "Follow-up": "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  Consultation: "bg-green-500/10 text-green-700 dark:text-green-400",
  Emergency: "bg-red-500/10 text-red-700 dark:text-red-400",
}

interface AppointmentsListProps {
  appointments?: any[]
  onViewAll?: () => void
  onAppointmentUpdated?: (updatedAppointment: any) => void
}

export function AppointmentsList({ appointments = [], onViewAll, onAppointmentUpdated }: AppointmentsListProps) {
  const displayedAppointments = appointments.slice(0, 5)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Today's Schedule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No appointments scheduled</p>
          </div>
        ) : (
          <>
            {displayedAppointments.map((appointment) => (
              <AppointmentDetailDialog
                key={appointment.id}
                appointment={appointment}
                onAppointmentUpdated={onAppointmentUpdated}
              >
                <div className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors space-y-2 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {appointment.time}
                    </div>
                    <Badge
                      variant="secondary"
                      className={statusColors[appointment.status as keyof typeof statusColors]}
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-medium text-foreground">{appointment.patient || appointment.patient_name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground pl-5">{appointment.doctor || appointment.doctor_name}</p>
                  </div>
                  <Badge variant="secondary" className={typeColors[appointment.type as keyof typeof typeColors]}>
                    {appointment.type}
                  </Badge>
                </div>
              </AppointmentDetailDialog>
            ))}
          </>
        )}

        {appointments.length > 0 && (
          <Button variant="outline" className="w-full mt-4 bg-transparent" onClick={onViewAll}>
            View All Appointments ({appointments.length})
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
