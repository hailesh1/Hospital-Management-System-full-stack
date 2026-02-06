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
import { CalendarPlus } from "lucide-react"

import { useAuth } from "@/contexts/auth-context"

interface AddAppointmentDialogProps {
  onAddAppointment?: (appointment: any) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CreateAppointmentDialog({ onAddAppointment, open: externalOpen, onOpenChange: setExternalOpen }: AddAppointmentDialogProps) {
  const { user } = useAuth()
  const [internalOpen, setInternalOpen] = useState(false)

  const open = externalOpen !== undefined ? externalOpen : internalOpen
  const setOpen = setExternalOpen !== undefined ? setExternalOpen : setInternalOpen

  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    doctorId: "",
    doctorName: "",
    date: "",
    time: "",
    type: "",
    department: "",
    notes: "",
  })

  const [patients, setPatients] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)

  useEffect(() => {
    if (open) {
      fetchPatientsAndDoctors()
    }
  }, [open])

  useEffect(() => {
    if (user?.role === 'doctor' && doctors.length > 0) {
      console.log('Attempting to auto-match logged-in doctor:', user)

      // 1. Match by ID (handling string vs number)
      let currentDoctor = doctors.find(d =>
        d.id === user.id ||
        d.id.toString() === user.id.toString()
      )

      // 2. Fallback: match by name
      if (!currentDoctor && user.name) {
        const normalizedUserName = user.name.replace(/^Dr\.\s+/i, '').toLowerCase().trim()
        console.log('Auto-match by ID failed, trying name:', normalizedUserName)

        currentDoctor = doctors.find(d => {
          const doctorTitle = d.name || `${d.first_name || ''} ${d.last_name || ''}`.trim()
          const dbName = doctorTitle.replace(/^Dr\.\s+/i, '').toLowerCase().trim()
          return dbName.includes(normalizedUserName) || normalizedUserName.includes(dbName)
        })
      }

      if (currentDoctor) {
        console.log('Successfully matched doctor:', currentDoctor)
        setFormData(prev => ({
          ...prev,
          doctorId: currentDoctor.id.toString(),
          doctorName: currentDoctor.name || `${currentDoctor.first_name || ''} ${currentDoctor.last_name || ''}`.trim(),
          department: (currentDoctor.specialization || currentDoctor.department || "").toLowerCase()
        }))
      } else {
        console.warn('Auto-match for doctor failed.')
      }
    }
  }, [user, doctors])

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!formData.doctorId || !formData.date) {
        setAvailableSlots([])
        return
      }

      setIsCheckingAvailability(true)
      try {
        // Fetch existing appointments for this doctor on this date
        const res = await fetch(`/api/appointments?doctor_id=${formData.doctorId}&date=${formData.date}`)
        if (res.ok) {
          const appointments = await res.json()
          const bookedTimes = appointments.map((app: any) => app.time?.substring(0, 5)) // Extract HH:mm

          // Generate slots 09:00 to 17:00
          const slots = []
          for (let i = 9; i < 17; i++) {
            const hour = i.toString().padStart(2, '0')
            slots.push(`${hour}:00`)
            slots.push(`${hour}:30`)
          }

          // Filter out booked slots
          // Map slots with taken status
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
  }, [formData.doctorId, formData.date])

  const fetchPatientsAndDoctors = async () => {
    setLoading(true)
    try {
      const [patientsRes, doctorsRes] = await Promise.all([
        fetch('/api/patients'),
        fetch('/api/doctors')
      ])

      if (patientsRes.ok) {
        const patientsData = await patientsRes.json()
        setPatients(patientsData)
      }

      if (doctorsRes.ok) {
        const doctorsData = await doctorsRes.json()
        setDoctors(doctorsData)
      }
    } catch (error) {
      console.error("Failed to fetch patients/doctors:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.doctorId) {
        throw new Error("Please select a doctor for this appointment.")
      }
      const appointmentDate = new Date(`${formData.date}T${formData.time}`).toISOString()

      const payload = {
        patient_id: formData.patientId,
        doctor_id: formData.doctorId,
        appointment_date: appointmentDate,
        reason: formData.notes || "Regular appointment",
        status: "scheduled",
        type: formData.type || "Consultation",
      }

      console.log('Submitting appointment with payload:', payload)
      console.log('Current formData:', formData)

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to schedule appointment')
      }

      const newAppointment = await response.json()

      if (onAddAppointment) {
        onAddAppointment(newAppointment)
      }

      setOpen(false)
      setFormData(prev => ({
        patientId: "",
        patientName: "",
        doctorId: user?.role === 'doctor' ? prev.doctorId : "",
        doctorName: user?.role === 'doctor' ? prev.doctorName : "",
        date: "",
        time: "",
        type: "",
        department: prev.department,
        notes: "",
      }))
    } catch (error: any) {
      console.error("Error creating appointment:", error)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {externalOpen === undefined && (
        <DialogTrigger asChild>
          <Button className="gap-2">
            <CalendarPlus className="h-4 w-4" />
            New Appointment
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Schedule New Appointment</DialogTitle>
          <DialogDescription>Create a new appointment for a patient</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patientId">Patient *</Label>
            <Select
              value={formData.patientId}
              onValueChange={(value) => {
                const patient = patients.find((p) => p.id === value || p.id.toString() === value)
                const patientName = patient?.name || `${patient?.first_name || ''} ${patient?.last_name || ''}`.trim()
                setFormData({ ...formData, patientId: value, patientName })
              }}
            >
              <SelectTrigger id="patientId">
                <SelectValue placeholder="Select patient" />
              </SelectTrigger>
              <SelectContent className="z-[9999]">
                {loading ? (
                  <div className="p-2 text-sm text-muted-foreground">Loading patients...</div>
                ) : patients.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">No patients found</div>
                ) : (
                  patients.map((patient) => {
                    const displayName = patient.name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim()
                    return (
                      <SelectItem key={patient.id} value={patient.id.toString()}>
                        {displayName}
                      </SelectItem>
                    )
                  })
                )}
              </SelectContent>
            </Select>
          </div>

          {/* 
            Always show doctor selection if doctorId is not set, 
            even for doctor role (e.g. if auto-detect fails) 
          */}
          {(user?.role !== 'doctor' || !formData.doctorId) && (
            <div className="space-y-2">
              <Label htmlFor="doctorId">Doctor *</Label>
              <Select
                value={formData.doctorId}
                onValueChange={(value) => {
                  const doctor = doctors.find((d) => d.id === value || d.id.toString() === value)
                  setFormData({ ...formData, doctorId: value, doctorName: doctor?.name || "" })
                }}
              >
                <SelectTrigger id="doctorId">
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent className="z-[9999]">
                  {loading ? (
                    <div className="p-2 text-sm text-muted-foreground">Loading doctors...</div>
                  ) : doctors.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">No doctors found</div>
                  ) : (
                    doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id.toString()}>
                        {doctor.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Time *</Label>
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
                      variant={formData.time === slotData.time ? "default" : "outline"}
                      disabled={slotData.taken}
                      className={`h-9 text-[10px] relative ${formData.time === slotData.time ? "bg-primary text-primary-foreground" : slotData.taken ? "bg-muted text-muted-foreground border-dashed opacity-60" : "hover:bg-accent"}`}
                      onClick={() => setFormData({ ...formData, time: slotData.time })}
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
                    {!formData.date || !formData.doctorId
                      ? "Select doctor and date first"
                      : "No available slots for this date"}
                  </div>
                )}
              </div>
              {formData.time && (
                <div className="text-xs text-muted-foreground mt-1">
                  Selected time: <span className="font-medium">{formData.time}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Appointment Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="checkup">Checkup</SelectItem>
                <SelectItem value="procedure">Procedure</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(user?.role !== 'doctor' || !formData.department) && (
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="general">General Medicine</SelectItem>
                  <SelectItem value="orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="neurology">Neurology</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Reason for Visit</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Describe the reason for this appointment..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Schedule Appointment</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
