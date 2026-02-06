"use client"

import { useEffect, useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Pill, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"

interface AddPrescriptionDialogProps {
  appointment?: any
  onPrescriptionAdded?: (prescription: any) => void
}

export function AddPrescriptionDialog({ appointment, onPrescriptionAdded }: AddPrescriptionDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const [patients, setPatients] = useState<any[]>([])
  const [loadingPatients, setLoadingPatients] = useState(false)
  const [selectedPatientId, setSelectedPatientId] = useState<string>("")
  const [selectedPatientName, setSelectedPatientName] = useState<string>("")
  const [formData, setFormData] = useState({
    medicationName: "",
    dosage: "",
    frequency: "",
    duration: "",
    notes: "",
  })

  useEffect(() => {
    if (open) {
      setLoadingPatients(true)
      fetch("/api/patients")
        .then(async (res) => {
          if (res.ok) {
            const data = await res.json()
            setPatients(data)
            if (appointment?.patientId || appointment?.patient_id) {
              const pid = appointment.patientId || appointment.patient_id
              setSelectedPatientId(pid)
              const p = data.find((x: any) => x.id === pid)
              setSelectedPatientName(p ? p.name : (appointment.patient || appointment.patient_name || ""))
            }
          }
        })
        .catch((e) => console.error("Failed to fetch patients:", e))
        .finally(() => setLoadingPatients(false))
    }
  }, [open, appointment])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const patientId =
        selectedPatientId ||
        appointment?.patientId ||
        appointment?.patient_id ||
        ""

      if (!patientId) {
        throw new Error("Please select a patient")
      }

      const payload = {
        patientId,
        prescribedBy: user?.name || appointment?.doctor || appointment?.doctor_name,
        doctorId: user?.id,
        ...formData,
        refillsRemaining: 0
      }

      const response = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const bodyText = await response.text()
        let defaultMsg = 'Failed to create prescription'
        try {
          const err = JSON.parse(bodyText)
          const msg = err?.error || defaultMsg
          const details = err?.details ? `\nDetails: ${err.details}` : ''
          const code = err?.code ? `\nCode: ${err.code}` : ''
          throw new Error(`${msg}${details}${code}`)
        } catch {
          throw new Error(bodyText || defaultMsg)
        }
      }

      const newPrescription = await response.json()
      
      if (onPrescriptionAdded) {
        onPrescriptionAdded(newPrescription)
      }

      setOpen(false)
      setFormData({
        medicationName: "",
        dosage: "",
        frequency: "",
        duration: "",
        notes: "",
      })
      alert("Prescription added successfully")
    } catch (error: any) {
      console.error("Error creating prescription:", error)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2 bg-orange-600 hover:bg-orange-700 text-white">
          <Pill className="h-4 w-4" />
          Add Prescription
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Prescription</DialogTitle>
          <DialogDescription>
            Prescribe medication {selectedPatientName ? `for ${selectedPatientName}` : ""}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patientSelect">Select Patient</Label>
            <Select
              value={selectedPatientId}
              onValueChange={(pid) => {
                setSelectedPatientId(pid)
                const p = patients.find((x) => x.id === pid)
                setSelectedPatientName(p ? p.name : "")
              }}
              disabled={loadingPatients}
            >
              <SelectTrigger id="patientSelect">
                <SelectValue placeholder={loadingPatients ? "Loading patients..." : "Select patient"} />
              </SelectTrigger>
              <SelectContent className="z-[9999] max-h-[300px]">
                {patients.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground text-center">No patients found.</div>
                ) : (
                  patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} ({patient.id})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicationName">Medication Name</Label>
            <Input
              id="medicationName"
              value={formData.medicationName}
              onChange={(e) => setFormData({ ...formData, medicationName: e.target.value })}
              required
              placeholder="e.g. Amoxicillin"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage</Label>
              <Input
                id="dosage"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                placeholder="e.g. 500mg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Input
                id="frequency"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                placeholder="e.g. 3 times daily"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="e.g. 7 days"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional instructions..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save Prescription"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
