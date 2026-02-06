"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Printer } from "lucide-react"
import type { Prescription } from "@/types"

interface PrescriptionDetailDialogProps {
  prescription: Prescription
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (prescription: Prescription) => void
}

export function PrescriptionDetailDialog({
  prescription,
  open,
  onOpenChange,
  onUpdate,
}: PrescriptionDetailDialogProps) {

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Prescription Details</DialogTitle>
            <Badge className={getStatusColor(prescription.status)}>{prescription.status}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Prescription ID</p>
              <p className="font-semibold">{prescription.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Patient Name</p>
              <p className="font-semibold">{prescription.patientName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Medication</p>
              <p className="font-semibold">{prescription.medicationName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dosage</p>
              <p className="font-semibold">{prescription.dosage}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Frequency</p>
              <p className="font-semibold">{prescription.frequency}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-semibold">{prescription.duration}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Prescribed By</p>
              <p className="font-semibold">{prescription.prescribedBy}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Prescribed Date</p>
              <p className="font-semibold">{new Date(prescription.prescribedDate).toLocaleDateString()}</p>
            </div>
          </div>

          {prescription.refillsRemaining !== undefined && (
            <div>
              <p className="text-sm text-muted-foreground">Refills Remaining</p>
              <p className="font-semibold">{prescription.refillsRemaining}</p>
            </div>
          )}

          {prescription.notes && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Notes</p>
                <p className="text-sm">{prescription.notes}</p>
              </div>
            </>
          )}

          <Separator />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
