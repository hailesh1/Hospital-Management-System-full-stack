"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Eye, FileText, Download, Calendar, User } from "lucide-react"

interface RecordDetailDialogProps {
  record: any
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function RecordDetailDialog({ record, open, onOpenChange }: RecordDetailDialogProps) {
  const content = (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Medical Record Details</DialogTitle>
        <DialogDescription>Complete information about this medical record</DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Record ID</p>
            <p className="font-mono font-medium">{record.id}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Type</p>
            <Badge variant="secondary">{record.type}</Badge>
          </div>
        </div>

        <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{record.patient}</p>
              <p className="text-xs text-muted-foreground">Patient ID: {record.patientId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm">{record.date}</p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Document Title</h4>
          <p className="text-foreground">{record.title}</p>
        </div>

        {record.description && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Description</h4>
            <p className="text-sm text-muted-foreground">{record.description}</p>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-medium">File Information</h4>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">{record.fileName}</p>
              <p className="text-xs text-muted-foreground">{record.fileSize}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => {
            import('jspdf').then(({ jsPDF }) => {
              const doc = new jsPDF()
              doc.setFontSize(20)
              doc.text("Medical Record Summary", 20, 20)
              doc.setFontSize(12)
              doc.text(`Patient: ${record.patient}`, 20, 40)
              doc.text(`Date: ${record.date}`, 20, 50)
              doc.text(`Title: ${record.title}`, 20, 60)
              doc.text(`Type: ${record.type}`, 20, 70)
              doc.text(`Description: ${record.description || 'N/A'}`, 20, 90)
              doc.save(record.fileName || "record.pdf")
            })
          }}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </DialogContent>
  )

  if (open !== undefined) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {content}
      </Dialog>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </DropdownMenuItem>
      </DialogTrigger>
      {content}
    </Dialog>
  )
}
