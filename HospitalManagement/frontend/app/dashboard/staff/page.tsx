"use client"

import { useState, useEffect } from "react"
import { StaffTable } from "@/components/staff/staff-table"
import { StaffStats } from "@/components/staff/staff-stats"
import { AddStaffDialog } from "@/components/staff/add-staff-dialog"

export default function StaffPage() {
  const [staffList, setStaffList] = useState<any[]>([])

  useEffect(() => {
    const savedStaff = localStorage.getItem("hospital_staff")
    if (savedStaff) {
      try {
        setStaffList(JSON.parse(savedStaff))
      } catch (error) {
        console.error("Error loading staff:", error)
      }
    }
  }, [])

  useEffect(() => {
    if (staffList.length > 0) {
      localStorage.setItem("hospital_staff", JSON.stringify(staffList))
    }
  }, [staffList])

  const handleAddStaff = (newStaff: any) => {
    console.log("[v0] Staff added, updating state and localStorage")
    setStaffList([newStaff, ...staffList])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Staff Management</h1>
          <p className="text-muted-foreground mt-1">Manage hospital staff and personnel</p>
        </div>
        <AddStaffDialog onAddStaff={handleAddStaff} />
      </div>

      <StaffStats />
      <StaffTable newStaff={staffList} />
    </div>
  )
}
