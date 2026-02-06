"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Printer } from "lucide-react"
import type { LabTest } from "@/types"

interface LabTestDetailDialogProps {
  test: LabTest
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (test: LabTest) => void
}

export function LabTestDetailDialog({ test, open, onOpenChange, onUpdate }: LabTestDetailDialogProps) {

  const getStatusColor = (status: LabTest["status"]) => {
    switch (status) {
      case "ordered":
        return "bg-blue-500/10 text-blue-500"
      case "sample-collected":
        return "bg-yellow-500/10 text-yellow-500"
      case "in-progress":
        return "bg-orange-500/10 text-orange-500"
      case "completed":
        return "bg-green-500/10 text-green-500"
      case "cancelled":
        return "bg-gray-500/10 text-gray-500"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Lab Test Details</DialogTitle>
            <Badge className={getStatusColor(test.status)}>{test.status}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Test ID</p>
              <p className="font-semibold">{test.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Patient Name</p>
              <p className="font-semibold">{test.patientName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Test Name</p>
              <p className="font-semibold">{test.testName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Test Type</p>
              <p className="font-semibold capitalize">{test.testType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ordered By</p>
              <p className="font-semibold">{test.orderedBy}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ordered Date</p>
              <p className="font-semibold">{new Date(test.orderedDate).toLocaleDateString()}</p>
            </div>
          </div>

          {test.notes && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Notes</p>
                <p className="text-sm">{test.notes}</p>
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
