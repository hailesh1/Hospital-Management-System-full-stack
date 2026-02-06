"use client"

import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import type { Prescription, Patient, Staff } from "@/types"
import { useAuth } from "@/contexts/auth-context"

interface AddPrescriptionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (prescription: Prescription) => void
}

export function AddPrescriptionDialog({ open, onOpenChange, onAdd }: AddPrescriptionDialogProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState("")
  const [medicationName, setMedicationName] = useState("")
  const [dosage, setDosage] = useState("")
  const [frequency, setFrequency] = useState("")
  const [duration, setDuration] = useState("")
  const [prescribedBy, setPrescribedBy] = useState("")
  const [refills, setRefills] = useState(0)
  const [notes, setNotes] = useState("")

  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [patientsRes, doctorsRes] = await Promise.all([
          fetch('/api/patients'),
          fetch('/api/doctors')
        ])

        if (patientsRes.ok) {
          const data = await patientsRes.json()
          setPatients(data.map((p: any) => ({
            id: p.id,
            firstName: p.first_name || (p.name ? p.name.split(' ')[0] : ''),
            lastName: p.last_name || (p.name ? p.name.split(' ').slice(1).join(' ') : ''),
            email: p.email,
          })))
        }

        if (doctorsRes.ok) {
          const data = await doctorsRes.json()
          setStaff(data.map((d: any) => {
            // API returns 'name' as concatenated 'first_name || last_name'
            const nameParts = d.name ? d.name.split(' ') : ['', '']
            return {
              id: d.id,
              firstName: nameParts[0] || '',
              lastName: nameParts.slice(1).join(' ') || '',
              role: "doctor",
              specialization: d.specialization || d.specialization_name
            }
          }))
        }
      } catch (error) {
        console.error("Failed to fetch prescription data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (open) {
      fetchData()
    }
  }, [open])

  useEffect(() => {
    if (user?.role === 'doctor' && user.name) {
      setPrescribedBy(user.name.startsWith('Dr.') ? user.name : `Dr. ${user.name}`)
    }
  }, [user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const patient = patients.find((p) => p.id === selectedPatientId)
    if (!patient) return

    const newPrescription: Prescription = {
      id: `RX-${Date.now()}`,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      medicationName,
      dosage,
      frequency,
      duration,
      prescribedBy,
      prescribedDate: new Date().toISOString().split("T")[0],
      status: "active",
      notes: notes || undefined,
      refillsRemaining: refills || undefined,
    }

    onAdd(newPrescription)

    // Reset form
    setSelectedPatientId("")
    setMedicationName("")
    setDosage("")
    setFrequency("")
    setDuration("")
    setPrescribedBy("")
    setRefills(0)
    setNotes("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Prescription</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Patient</Label>
              <Select value={selectedPatientId} onValueChange={setSelectedPatientId} required>
                <SelectTrigger id="patient">
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent className="z-[9999] max-h-[300px]">
                  {patients.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">No patients found. Add a patient first.</div>
                  ) : (
                    patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prescribedBy">Prescribed By</Label>
              <Select value={prescribedBy} onValueChange={setPrescribedBy} required>
                <SelectTrigger id="prescribedBy">
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {staff.map((doctor) => (
                    <SelectItem key={doctor.id} value={`${doctor.firstName} ${doctor.lastName}`}>
                      Dr. {doctor.firstName} {doctor.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicationName">Medication Name</Label>
            <Input
              id="medicationName"
              value={medicationName}
              onChange={(e) => setMedicationName(e.target.value)}
              placeholder="e.g., Amoxicillin"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage</Label>
              <Input
                id="dosage"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g., 500mg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Input
                id="frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                placeholder="e.g., 3 times daily"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 7 days"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="refills">Refills Remaining</Label>
            <Input
              id="refills"
              type="number"
              min="0"
              value={Number.isNaN(refills) ? "" : refills}
              onChange={(e) => {
                const val = e.target.value === "" ? 0 : Number.parseInt(e.target.value)
                setRefills(Number.isNaN(val) ? 0 : val)
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional instructions..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Prescription</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
