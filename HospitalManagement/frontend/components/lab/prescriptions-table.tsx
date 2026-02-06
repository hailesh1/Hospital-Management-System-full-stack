"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import type { Prescription } from "@/types"
import { useState } from "react"
import { PrescriptionDetailDialog } from "./prescription-detail-dialog"

interface PrescriptionsTableProps {
  prescriptions: Prescription[]
  onUpdate: (prescription: Prescription) => void
}

export function PrescriptionsTable({ prescriptions, onUpdate }: PrescriptionsTableProps) {
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)

  const getStatusColor = (status: Prescription["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500"
      case "completed":
        return "bg-blue-500/10 text-blue-500"
      case "discontinued":
        return "bg-red-500/10 text-red-500"
    }
  }

  if (prescriptions.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No prescriptions found.</div>
  }

  return (
    <>
      <div className="max-h-[500px] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prescription ID</TableHead>
              <TableHead>Patient Name</TableHead>
              <TableHead>Medication</TableHead>
              <TableHead>Dosage</TableHead>
              <TableHead>Prescribed Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prescriptions.map((prescription) => (
              <TableRow key={prescription.id} className="transition-all duration-300 hover:bg-red-600/[0.04] hover:shadow-inner cursor-pointer group">
                <TableCell className="font-bold text-gray-800 group-hover:text-red-800">{prescription.id}</TableCell>
                <TableCell className="font-semibold">{prescription.patientName}</TableCell>
                <TableCell className="font-black text-red-600 tracking-tight">{prescription.medicationName}</TableCell>
                <TableCell className="font-medium">{prescription.dosage}</TableCell>
                <TableCell>{new Date(prescription.prescribedDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(prescription.status)}>{prescription.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200 shadow-sm" onClick={() => setSelectedPrescription(prescription)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedPrescription && (
        <PrescriptionDetailDialog
          prescription={selectedPrescription}
          open={!!selectedPrescription}
          onOpenChange={(open) => !open && setSelectedPrescription(null)}
          onUpdate={onUpdate}
        />
      )}
    </>
  )
}
