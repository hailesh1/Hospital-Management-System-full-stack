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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface EditStaffDialogProps {
    staff: any
    open: boolean
    onOpenChange: (open: boolean) => void
    onUpdate: () => void
}

export function EditStaffDialog({ staff, open, onOpenChange, onUpdate }: EditStaffDialogProps) {
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
        status: "ACTIVE",
    })

    useEffect(() => {
        if (open) {
            fetchDepartments()
        }
        if (staff) {
            setFormData({
                firstName: staff.first_name || "",
                lastName: staff.last_name || "",
                email: staff.email || "",
                phone: staff.phone || "",
                role: staff.role || "",
                departmentId: staff.department_id || "none",
                specialization: staff.specialization || "",
                status: staff.status || "ACTIVE",
            })
        }
    }, [staff, open])

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
        if (!staff) return
        setLoading(true)

        try {
            const payload = {
                ...formData,
                departmentId: formData.departmentId === 'none' ? '' : formData.departmentId
            }

            const response = await fetch(`/api/staff/${staff.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                throw new Error('Failed to update staff member')
            }

            toast.success("Staff member updated successfully")
            onUpdate()
            onOpenChange(false)
        } catch (error: any) {
            toast.error(error.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    if (!staff) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Staff Details</DialogTitle>
                    <DialogDescription>Update information for {staff.first_name} {staff.last_name}</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-firstName">First Name</Label>
                            <Input
                                id="edit-firstName"
                                required
                                value={formData.firstName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, firstName: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-lastName">Last Name</Label>
                            <Input
                                id="edit-lastName"
                                required
                                value={formData.lastName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, lastName: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-email">Email</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-phone">Phone Number</Label>
                            <Input
                                id="edit-phone"
                                required
                                value={formData.phone}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-role">Role</Label>
                            <Select value={formData.role} onValueChange={(value: string) => setFormData({ ...formData, role: value })}>
                                <SelectTrigger id="edit-role">
                                    <SelectValue />
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
                            <Label htmlFor="edit-department">Department</Label>
                            <Select
                                value={formData.departmentId}
                                onValueChange={(value: string) => setFormData({ ...formData, departmentId: value })}
                            >
                                <SelectTrigger id="edit-department">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No Department</SelectItem>
                                    {departments.map((dept: any) => (
                                        <SelectItem key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-status">Status</Label>
                            <Select value={formData.status} onValueChange={(value: string) => setFormData({ ...formData, status: value })}>
                                <SelectTrigger id="edit-status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACTIVE">Active / Available</SelectItem>
                                    <SelectItem value="BUSY">Busy</SelectItem>
                                    <SelectItem value="AWAY">Away</SelectItem>
                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-border">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
