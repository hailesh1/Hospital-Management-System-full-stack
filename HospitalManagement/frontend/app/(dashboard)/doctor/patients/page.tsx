"use client"

import { useEffect, useState } from "react"
import { PatientsTable } from "@/components/patients/patients-table"
import { AddPatientDialog } from "@/components/patients/add-patient-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Patient } from "@/types"

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('/api/patients')
        if (response.ok) {
          const data = await response.json()
          setPatients(data)
        }
      } catch (error) {
        console.error("Error fetching patients:", error)
      }
    }
    fetchPatients()
  }, [])

  const handlePatientUpdated = (updatedPatient: any) => {
    setPatients(patients.map((p: any) =>
      p.id === updatedPatient.id ? updatedPatient : p
    ))
  }

  const handleAddPatient = (newPatient: Patient) => {
    setPatients(prev => [newPatient, ...prev])
    setIsAddOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Patients</h1>
          <p className="text-muted-foreground">
            View details and history of your patients.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Patient
        </Button>
      </div>

      <PatientsTable newPatients={patients} onPatientUpdated={handlePatientUpdated} hideId={true} />

      <AddPatientDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onPatientAdded={handleAddPatient}
      />
    </div>
  )
}
