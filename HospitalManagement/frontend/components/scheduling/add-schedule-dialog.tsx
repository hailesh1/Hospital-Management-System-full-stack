"use client"

import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import type { StaffSchedule, Staff } from "@/types"

interface AddScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (schedule: StaffSchedule) => void
}

export function AddScheduleDialog({ open, onOpenChange, onAdd }: AddScheduleDialogProps) {
  const [staff, setStaff] = useState<Staff[]>([])
  const [selectedStaffId, setSelectedStaffId] = useState("")
  const [date, setDate] = useState("")
  const [shiftType, setShiftType] = useState<StaffSchedule["shiftType"]>("morning")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [department, setDepartment] = useState("")

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
          phone: "0922334455", role: "nurse", department: "ICU",
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

    const newSchedule: StaffSchedule = {
      id: `SCH-${Date.now()}`,
      staffId: selectedStaff.id,
      staffName: `${selectedStaff.firstName} ${selectedStaff.lastName}`,
      date,
      shiftType,
      startTime,
      endTime,
      department,
      status: "scheduled",
    }

    onAdd(newSchedule)

    // Reset form
    setSelectedStaffId("")
    setDate("")
    setShiftType("morning")
    setStartTime("")
    setEndTime("")
    setDepartment("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Staff Schedule</DialogTitle>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shiftType">Shift Type</Label>
              <Select value={shiftType} onValueChange={(value: any) => setShiftType(value)} required>
                <SelectTrigger id="shiftType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="night">Night</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g., Emergency, ICU, Cardiology"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Schedule</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
