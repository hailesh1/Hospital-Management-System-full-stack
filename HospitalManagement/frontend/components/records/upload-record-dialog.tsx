"use client"

import React, { useState, useEffect } from "react"
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
import { Upload, FileText } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface UploadRecordDialogProps {
  onUploadRecord?: (record: any) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function UploadRecordDialog({ onUploadRecord, open: externalOpen, onOpenChange: setExternalOpen }: UploadRecordDialogProps) {
  const { user } = useAuth()
  const [internalOpen, setInternalOpen] = React.useState(false)

  const open = externalOpen !== undefined ? externalOpen : internalOpen
  const setOpen = setExternalOpen !== undefined ? setExternalOpen : setInternalOpen
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [formData, setFormData] = React.useState({
    patientId: "",
    patientName: "",
    recordType: "",
    title: "",
    description: "",
  })

  const [isUploading, setIsUploading] = React.useState(false)
  const [patients, setPatients] = React.useState<any[]>([])
  const [loadingPatients, setLoadingPatients] = React.useState(false)

  React.useEffect(() => {
    const fetchPatients = async () => {
      if (!open) return
      setLoadingPatients(true)
      try {
        const res = await fetch('/api/patients')
        if (res.ok) {
          const data = await res.json()
          setPatients(data)
        }
      } catch (error) {
        console.error("Failed to fetch patients:", error)
      } finally {
        setLoadingPatients(false)
      }
    }
    fetchPatients()
  }, [open])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      console.log("[v0] File selected:", e.target.files[0].name)
    }
  }

  const handlePatientChange = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId)
    setFormData({
      ...formData,
      patientId,
      patientName: patient ? patient.name : ""
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) return;

    setIsUploading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);

      const uploadRes = await fetch('/api/medical-records/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!uploadRes.ok) {
        throw new Error('File upload failed');
      }

      const uploadData = await uploadRes.json();
      console.log("[v0] File uploaded:", uploadData);

      const newRecord = {
        id: `MR${String(Date.now()).slice(-3)}`,
        patient: formData.patientName,
        patientId: formData.patientId,
        date: new Date().toISOString().split("T")[0],
        title: formData.title,
        type: formData.recordType,
        fileName: uploadData.fileName,
        fileSize: selectedFile ? `${(selectedFile.size / 1024).toFixed(2)} KB` : "0 KB",
        description: formData.description,
        doctor: user?.name,
        doctorId: user?.id,
      }

      console.log("[v0] New record created:", newRecord)

      if (onUploadRecord) {
        onUploadRecord(newRecord)
      }

      setOpen(false)
      setSelectedFile(null)
      setFormData({
        patientId: "",
        patientName: "",
        recordType: "",
        title: "",
        description: "",
      })
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload file. Please check if the storage service is running.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Medical Record</DialogTitle>
          <DialogDescription>Upload a new medical document or record</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patientSelect">Select Patient *</Label>
            <Select
              value={formData.patientId}
              onValueChange={handlePatientChange}
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
            <Label htmlFor="recordType">Record Type *</Label>
            <Select
              value={formData.recordType}
              onValueChange={(value) => setFormData({ ...formData, recordType: value })}
            >
              <SelectTrigger id="recordType">
                <SelectValue placeholder="Select record type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lab">Lab Results</SelectItem>
                <SelectItem value="xray">X-Ray</SelectItem>
                <SelectItem value="mri">MRI Scan</SelectItem>
                <SelectItem value="prescription">Prescription</SelectItem>
                <SelectItem value="report">Medical Report</SelectItem>
                <SelectItem value="consent">Consent Form</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Document Title *</Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Blood Test Results - Jan 2024"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">File Upload *</Label>
            <div className="flex items-center gap-2">
              <Input id="file" type="file" required onChange={handleFileChange} className="cursor-pointer" />
            </div>
            {selectedFile && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{selectedFile.name}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add notes about this record..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedFile || isUploading}>
              {isUploading ? "Uploading..." : "Upload Record"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
