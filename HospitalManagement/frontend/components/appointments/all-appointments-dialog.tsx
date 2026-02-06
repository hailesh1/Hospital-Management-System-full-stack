"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, User, Calendar } from "lucide-react"

interface AllAppointmentsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointments: any[]
}

export function AllAppointmentsDialog({ open, onOpenChange, appointments }: AllAppointmentsDialogProps) {
  const statusColors = {
    confirmed: "bg-green-500/10 text-green-700 dark:text-green-400",
    scheduled: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    completed: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
    cancelled: "bg-red-500/10 text-red-700 dark:text-red-400",
    "in-progress": "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>All Appointments</DialogTitle>
          <DialogDescription>
            Complete list of all scheduled appointments ({appointments.length} total)
          </DialogDescription>
        </DialogHeader>

        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No appointments scheduled yet.</p>
          </div>
        ) : (
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm font-medium">{appointment.time}</span>
                        </div>
                        {appointment.date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{appointment.date}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{appointment.patient}</p>
                          {appointment.patientId && (
                            <p className="text-xs text-muted-foreground font-mono">{appointment.patientId}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{appointment.doctor}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {appointment.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{appointment.department || "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={statusColors[appointment.status as keyof typeof statusColors]}
                      >
                        {appointment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm text-muted-foreground truncate">{appointment.reason || "N/A"}</p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
