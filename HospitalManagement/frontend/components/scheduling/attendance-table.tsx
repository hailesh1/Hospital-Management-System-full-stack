"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Attendance } from "@/types"

interface AttendanceTableProps {
  attendance: Attendance[]
}

export function AttendanceTable({ attendance }: AttendanceTableProps) {
  const getStatusColor = (status: Attendance["status"]) => {
    switch (status) {
      case "present":
        return "bg-green-500/10 text-green-500"
      case "absent":
        return "bg-red-500/10 text-red-500"
      case "late":
        return "bg-orange-500/10 text-orange-500"
      case "half-day":
        return "bg-yellow-500/10 text-yellow-500"
      case "on-leave":
        return "bg-blue-500/10 text-blue-500"
    }
  }

  if (attendance.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No attendance records found. Mark attendance to get started.
      </div>
    )
  }

  return (
    <div className="max-h-[500px] overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Staff Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Check-In</TableHead>
            <TableHead>Check-Out</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendance.map((record) => (
            <TableRow key={record.id} className="transition-all duration-200 hover:bg-muted/50 hover:shadow-sm">
              <TableCell className="font-medium">{record.staffName}</TableCell>
              <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
              <TableCell>{record.checkIn || "-"}</TableCell>
              <TableCell>{record.checkOut || "-"}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{record.notes || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
