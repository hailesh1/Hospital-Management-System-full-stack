"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Clock, User, Calendar } from "lucide-react"

interface AppointmentsTableProps {
    appointments: any[]
}

export function AppointmentsTable({ appointments }: AppointmentsTableProps) {
    const statusColors = {
        confirmed: "bg-green-500/10 text-green-700 dark:text-green-400",
        scheduled: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
        completed: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
        cancelled: "bg-red-500/10 text-red-700 dark:text-red-400",
        "in-progress": "bg-orange-500/10 text-orange-700 dark:text-orange-400",
    }

    if (appointments.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No appointments scheduled yet.
            </div>
        )
    }

    return (
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
                        <TableRow key={appointment.id} className="transition-all duration-300 hover:bg-red-600/[0.04] hover:shadow-inner cursor-pointer group border-b-red-50">
                            <TableCell>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300">
                                        <Clock className="h-3.5 w-3.5 text-red-400 group-hover:text-red-600" />
                                        <span className="text-sm font-bold group-hover:text-red-700">{appointment.time}</span>
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
                                    <User className="h-4 w-4 text-red-400 group-hover:text-red-600 group-hover:scale-110 transition-all" />
                                    <div>
                                        <p className="text-sm font-bold text-gray-800 group-hover:text-red-800">
                                            {appointment.patient || appointment.patient_name || "Unknown Patient"}
                                        </p>
                                        {(appointment.patientId || appointment.patient_id) && (
                                            <p className="text-xs text-muted-foreground font-mono">
                                                {appointment.patientId || appointment.patient_id}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-sm font-bold text-gray-700 group-hover:text-red-700">
                                {appointment.doctor || appointment.doctor_name || "N/A"}
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className="text-xs">
                                    {appointment.type}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-sm">{appointment.department || "N/A"}</TableCell>
                            <TableCell>
                                <Badge
                                    className={cn("font-bold shadow-sm ring-1 ring-inset", statusColors[appointment.status as keyof typeof statusColors])}
                                >
                                    {appointment.status.toUpperCase()}
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
    )
}
