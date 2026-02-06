"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface AddStaffDialogProps {
  onAddStaff?: (staff: any) => void
}

export function AddStaffDialog({ onAddStaff }: AddStaffDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [departments, setDepartments] = useState<any[]>([])
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    departmentId: "",
    specialization: "",
    joinDate: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    if (open) {
      fetchDepartments()
    }
  }, [open])

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments')
      const data = await response.json()
      if (Array.isArray(data)) {
        setDepartments(data)
      }
    } catch (error) {
      console.error("Failed to fetch departments:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to add staff member')
      }

      const newStaff = await response.json()

      if (onAddStaff) {
        onAddStaff(newStaff)
      }

      toast.success("Staff member added successfully")
      setOpen(false)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "",
        departmentId: "",
        specialization: "",
        joinDate: new Date().toISOString().split('T')[0],
      })
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Staff Member
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Staff Member</DialogTitle>
          <DialogDescription>Enter staff member information to create a new record</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                required
                value={formData.firstName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Enter first name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                required
                value={formData.lastName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Enter last name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                placeholder="staff@hospital.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (+251) *</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+251 912 345 678"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DOCTOR">Doctor</SelectItem>
                  <SelectItem value="NURSE">Nurse</SelectItem>
                  <SelectItem value="ADMIN">Admin Staff</SelectItem>
                  <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select
                value={formData.departmentId}
                onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept: any) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                  {departments.length === 0 && (
                    <div className="p-2 text-sm text-muted-foreground text-center">No departments found</div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                value={formData.specialization}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="e.g., Cardiac Surgery"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="joinDate">Join Date *</Label>
              <Input
                id="joinDate"
                type="date"
                required
                value={formData.joinDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, joinDate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Staff Member
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
