"use client"

import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import type { LabTest, Patient, Staff } from "@/types"
import { useAuth } from "@/contexts/auth-context"

interface OrderLabTestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (test: LabTest) => void
}

export function OrderLabTestDialog({ open, onOpenChange, onAdd }: OrderLabTestDialogProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState("")
  const [testName, setTestName] = useState("")
  const [testType, setTestType] = useState<LabTest["testType"]>("blood")
  const [orderedBy, setOrderedBy] = useState("")
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
            }
          }))
        }
      } catch (error) {
        console.error("Failed to fetch lab test data:", error)
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
      setOrderedBy(user.name.startsWith('Dr.') ? user.name : `Dr. ${user.name}`)
    }
  }, [user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const patient = patients.find((p) => p.id === selectedPatientId)
    if (!patient) return

    const newTest: LabTest = {
      id: `LAB-${Date.now()}`,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      testName,
      testType,
      orderedBy,
      orderedDate: new Date().toISOString().split("T")[0],
      status: "ordered",
      notes: notes || undefined,
    }

    onAdd(newTest)

    // Reset form
    setSelectedPatientId("")
    setTestName("")
    setTestType("blood")
    setOrderedBy("")
    setNotes("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order Lab Test</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="testName">Test Name</Label>
            <Input
              id="testName"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder="e.g., Complete Blood Count"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="testType">Test Type</Label>
            <Select value={testType} onValueChange={(value: any) => setTestType(value)} required>
              <SelectTrigger id="testType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blood">Blood Test</SelectItem>
                <SelectItem value="urine">Urine Test</SelectItem>
                <SelectItem value="xray">X-Ray</SelectItem>
                <SelectItem value="mri">MRI</SelectItem>
                <SelectItem value="ct-scan">CT Scan</SelectItem>
                <SelectItem value="ultrasound">Ultrasound</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="orderedBy">Ordered By</Label>
            <Select value={orderedBy} onValueChange={setOrderedBy} required>
              <SelectTrigger id="orderedBy">
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
            <Button type="submit">Order Test</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
