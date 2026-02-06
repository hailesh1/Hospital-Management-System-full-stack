"use client"

import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import type { Attendance, Staff } from "@/types"

interface MarkAttendanceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (attendance: Attendance) => void
}

export function MarkAttendanceDialog({ open, onOpenChange, onAdd }: MarkAttendanceDialogProps) {
  const [staff, setStaff] = useState<Staff[]>([])
  const [selectedStaffId, setSelectedStaffId] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [status, setStatus] = useState<Attendance["status"]>("present")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    const loadedStaff = JSON.parse(localStorage.getItem("staff") || "[]")
    if (loadedStaff.length === 0) {
      const mockStaff: Staff[] = [
        {
          id: "S001", firstName: "Abebe", lastName: "Tadesse", email: "abebe.t@hospital.com",
          phone: "0911223344", role: "doctor", specialization: "Cardiology",
          joinDate: "2020-01-01", status: "active"
        },
        {
          id: "S002", firstName: "Almaz", lastName: "Bekele", email: "almaz.b@hospital.com",
          phone: "0922334455", role: "nurse", department: "Pediatrics",
          joinDate: "2021-03-15", status: "active"
        },
        {
          id: "S003", firstName: "Dawit", lastName: "Alemu", email: "dawit.a@hospital.com",
          phone: "0933445566", role: "receptionist",
          joinDate: "2022-05-10", status: "active"
        }
      ]
      setStaff(mockStaff)
    } else {
      setStaff(loadedStaff)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const selectedStaff = staff.find((s) => s.id === selectedStaffId)
    if (!selectedStaff) return

    const newAttendance: Attendance = {
      id: `ATT-${Date.now()}`,
      staffId: selectedStaff.id,
      staffName: `${selectedStaff.firstName} ${selectedStaff.lastName}`,
      date,
      checkIn: checkIn || undefined,
      checkOut: checkOut || undefined,
      status,
      notes: notes || undefined,
    }

    onAdd(newAttendance)

    // Reset form
    setSelectedStaffId("")
    setDate(new Date().toISOString().split("T")[0])
    setCheckIn("")
    setCheckOut("")
    setStatus("present")
    setNotes("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark Attendance</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="staff">Staff Member</Label>
            <Select value={selectedStaffId} onValueChange={setSelectedStaffId} required>
              <SelectTrigger id="staff">
                <SelectValue placeholder="Select staff member" />
              </SelectTrigger>
              <SelectContent>
                {staff.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.firstName} {member.lastName} - {member.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkIn">Check-In Time</Label>
              <Input id="checkIn" type="time" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkOut">Check-Out Time</Label>
              <Input id="checkOut" type="time" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value: any) => setStatus(value)} required>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="half-day">Half Day</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Mark Attendance</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
