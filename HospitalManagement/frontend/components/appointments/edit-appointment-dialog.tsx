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
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/ui/icons"

interface EditAppointmentDialogProps {
    appointment: any
    onUpdateAppointment?: (updatedAppointment: any) => void
    open?: boolean
    onOpenChange?: (open: boolean) => void
    trigger?: React.ReactNode
}

export function EditAppointmentDialog({ appointment, onUpdateAppointment, open: externalOpen, onOpenChange: setExternalOpen, trigger }: EditAppointmentDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const open = externalOpen !== undefined ? externalOpen : internalOpen
    const setOpen = setExternalOpen !== undefined ? setExternalOpen : setInternalOpen

    const [formData, setFormData] = useState({
        date: "",
        time: "",
        status: "",
        notes: "",
    })

    useEffect(() => {
        if (appointment && open) {
            // Extract date and time from appointment, prefer fields 'date' and 'time' if available
            // Fallback to parsing appointment_date
            let dateStr = appointment.date || "";
            let timeStr = appointment.time || "";

            if (!dateStr || !timeStr) {
                const d = new Date(appointment.appointment_date || appointment.date);
                if (!isNaN(d.getTime())) {
                    dateStr = d.toISOString().split('T')[0];
                    timeStr = d.toTimeString().split(' ')[0].substring(0, 5);
                }
            }

            setFormData({
                date: dateStr,
                time: timeStr,
                status: appointment.status || "scheduled",
                notes: appointment.reason || "",
            })
        }
    }, [appointment, open])


    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Reconstruct appointment_date
            const appointmentDate = new Date(`${formData.date}T${formData.time}`).toISOString()

            const payload = {
                appointment_date: appointmentDate,
                reason: formData.notes,
                status: formData.status,
            }

            console.log('Updating appointment:', payload)

            const response = await fetch(`/api/appointments/${appointment.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                throw new Error('Failed to update appointment')
            }

            const updated = await response.json()

            if (onUpdateAppointment) {
                onUpdateAppointment(updated)
            }

            setOpen(false)
        } catch (error: any) {
            console.error("Error updating appointment:", error)
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Appointment</DialogTitle>
                    <DialogDescription>
                        Update details for <span className="font-bold text-foreground">{appointment?.patient_name || "Patient"}</span>
                        {appointment?.doctor_name && (
                            <> with <span className="font-bold text-foreground">Dr. {appointment.doctor_name}</span></>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-date">Date</Label>
                            <Input
                                id="edit-date"
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-time">Time</Label>
                            <Input
                                id="edit-time"
                                type="time"
                                required
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-status">Status</Label>
                        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                            <SelectTrigger id="edit-status">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="checked_in">Checked In</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-notes">Reason / Notes</Label>
                        <Textarea
                            id="edit-notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-border">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
