"use client"

import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import type { Staff } from "@/types"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

interface BookAppointmentDialogProps {
    onAdd: (appointment: any) => void
}

export function BookAppointmentDialog({ onAdd }: BookAppointmentDialogProps) {
    const { user } = useAuth()
    const [open, setOpen] = useState(false)
    const [doctors, setDoctors] = useState<Staff[]>([])
    const [selectedDoctorId, setSelectedDoctorId] = useState("")
    const [date, setDate] = useState("")
    const [time, setTime] = useState("")
    const [reason, setReason] = useState("")
    const [type, setType] = useState("Consultation")
    const [availableSlots, setAvailableSlots] = useState<string[]>([])
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)

    useEffect(() => {
        const fetchAvailability = async () => {
            if (!selectedDoctorId || !date) {
                setAvailableSlots([])
                return
            }

            setIsCheckingAvailability(true)
            try {
                const res = await fetch(`/api/appointments?doctor_id=${selectedDoctorId}&date=${date}`)
                if (res.ok) {
                    const appointments = await res.json()
                    const bookedTimes = appointments.map((app: any) => app.time?.substring(0, 5))

                    const slots = []
                    for (let i = 9; i < 17; i++) {
                        const hour = i.toString().padStart(2, '0')
                        slots.push(`${hour}:00`)
                        slots.push(`${hour}:30`)
                    }

                    const allSlots = slots.map(slot => ({
                        time: slot,
                        taken: bookedTimes.includes(slot)
                    }))
                    setAvailableSlots(allSlots as any)
                }
            } catch (error) {
                console.error("Failed to fetch availability:", error)
            } finally {
                setIsCheckingAvailability(false)
            }
        }

        fetchAvailability()
    }, [selectedDoctorId, date])

    useEffect(() => {
        const fetchDoctorsCount = async () => {
            try {
                const res = await fetch('/api/doctors')
                if (res.ok) {
                    const data = await res.json()
                    setDoctors(data)
                }
            } catch (error) {
                console.error("Failed to fetch doctors:", error)
            }
        }

        fetchDoctorsCount()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    patientId: user?.id,
                    doctorId: selectedDoctorId,
                    date: date, // LocalDate in YYYY-MM-DD format
                    time: time,
                    type: type.toUpperCase().replace("-", "_"),
                    notes: reason,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to book appointment')
            }

            const newAppointment = await response.json()
            onAdd(newAppointment)
            toast.success("Appointment booked successfully")
            setOpen(false)

            // Reset form
            setSelectedDoctorId("")
            setDate("")
            setTime("")
            setReason("")
        } catch (error: any) {
            console.error("Error booking appointment:", error)
            alert(error.message)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:scale-[1.05]">
                    <Plus className="mr-2 h-4 w-4" />
                    Book Appointment
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Book New Appointment</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="doctor">Select Doctor</Label>
                        <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a doctor" />
                            </SelectTrigger>
                            <SelectContent className="z-[9999]">
                                {doctors.map((doc) => (
                                    <SelectItem key={doc.id} value={doc.id}>
                                        {doc.firstName} {doc.lastName} ({doc.specialization})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Available Time Slots</Label>
                        <div className="grid grid-cols-4 gap-2 border rounded-md p-4 max-h-[200px] overflow-y-auto">
                            {isCheckingAvailability ? (
                                <div className="col-span-4 text-center py-4 text-sm text-muted-foreground">
                                    Checking availability...
                                </div>
                            ) : availableSlots.length > 0 ? (
                                availableSlots.map((slotData: any) => (
                                    <Button
                                        key={slotData.time}
                                        type="button"
                                        variant={time === slotData.time ? "default" : "outline"}
                                        disabled={slotData.taken}
                                        className={`h-9 text-[10px] relative ${time === slotData.time ? "bg-primary text-primary-foreground" : slotData.taken ? "bg-muted text-muted-foreground border-dashed opacity-60" : "hover:bg-accent"}`}
                                        onClick={() => setTime(slotData.time)}
                                    >
                                        {slotData.time}
                                        {slotData.taken && (
                                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-destructive text-[8px] px-1 rounded-sm text-white font-bold uppercase leading-tight">
                                                Taken
                                            </span>
                                        )}
                                    </Button>
                                ))
                            ) : (
                                <div className="col-span-4 text-center py-4 text-sm text-muted-foreground">
                                    {!date || !selectedDoctorId
                                        ? "Select doctor and date first"
                                        : "No available slots for this date"}
                                </div>
                            )}
                        </div>
                        {time && (
                            <div className="text-xs text-muted-foreground mt-1">
                                Selected time: <span className="font-medium">{time}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">Appointment Type</Label>
                        <Select value={type} onValueChange={setType} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent className="z-[9999]">
                                <SelectItem value="Consultation">Consultation</SelectItem>
                                <SelectItem value="Follow-up">Follow-up</SelectItem>
                                <SelectItem value="Checkup">Checkup</SelectItem>
                                <SelectItem value="Emergency">Emergency</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reason">Reason for Visit</Label>
                        <Textarea
                            id="reason"
                            placeholder="Briefly describe your symptoms or concern"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-primary hover:bg-primary/90">
                            Confirm Booking
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
