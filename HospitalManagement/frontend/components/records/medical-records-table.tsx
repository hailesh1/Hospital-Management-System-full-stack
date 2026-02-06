"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Download, File, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { RecordDetailDialog } from "./record-detail-dialog"

const typeColors = {
  consultation: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  "follow-up": "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  checkup: "bg-green-500/10 text-green-700 dark:text-green-400",
  emergency: "bg-red-500/10 text-red-700 dark:text-red-400",
  lab: "bg-teal-500/10 text-teal-700 dark:text-teal-400",
  xray: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
  mri: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  prescription: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  report: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
}

interface MedicalRecordsTableProps {
  newRecords?: any[]
}

export function MedicalRecordsTable({ newRecords = [] }: MedicalRecordsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredRecords = newRecords.filter((record) => {
    const matchesSearch =
      (record.patient?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (record.id?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (record.title?.toLowerCase() || "").includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || record.type === typeFilter

    return matchesSearch && matchesType
  })

  const handleDownload = (record: any) => {
    // Use the new view endpoint to download the real file from MinIO
    if (record.fileName && record.fileName !== "document.pdf") {
       // Open in new tab
       window.open(`/api/medical-records/view?fileName=${encodeURIComponent(record.fileName)}`, '_blank');
    } else {
        // Fallback for demo records or records without real files
        import('jspdf').then(({ jsPDF }) => {
        const doc = new jsPDF()

        // Header
        doc.setFontSize(20)
        doc.setTextColor(220, 38, 38) // Red color matching theme
        doc.text("Medical Record Summary", 20, 20)

        // Meta info
        doc.setFontSize(10)
        doc.setTextColor(100)
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30)

        doc.setDrawColor(200)
        doc.line(20, 35, 190, 35)

        // Content
        doc.setFontSize(12)
        doc.setTextColor(0)

        let y = 50
        const lineHeight = 10

        const addField = (label: string, value: string) => {
            doc.setFont("helvetica", "bold")
            doc.text(label + ":", 20, y)
            doc.setFont("helvetica", "normal")
            doc.text(value, 60, y)
            y += lineHeight
        }

        addField("Record ID", record.id || "N/A")
        addField("Patient Name", record.patient || "N/A")
        addField("Patient ID", record.patientId || "N/A")
        addField("Date", record.date || "N/A")
        addField("Title", record.title || "N/A")
        addField("Type", record.type || "N/A")
        addField("Original File", record.fileName || "N/A")

        y += 10
        doc.setFont("helvetica", "bold")
        doc.text("Description / Notes:", 20, y)
        y += 10
        doc.setFont("helvetica", "normal")

        const splitNotes = doc.splitTextToSize(record.description || "No description provided.", 170)
        doc.text(splitNotes, 20, y)

        // Footer
        const pageHeight = doc.internal.pageSize.height
        doc.setFontSize(8)
        doc.setTextColor(150)
        doc.text("This document is a wrapper for the original medical record file.", 20, pageHeight - 10)

        // Save
        const filename = record.fileName && record.fileName.endsWith('.pdf')
            ? record.fileName
            : `${record.title || 'record'}.pdf`

        doc.save(filename)
        })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search records by patient, ID, or title..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="consultation">Consultation</SelectItem>
              <SelectItem value="follow-up">Follow-up</SelectItem>
              <SelectItem value="checkup">Checkup</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
              <SelectItem value="lab">Lab Results</SelectItem>
              <SelectItem value="xray">X-Ray</SelectItem>
              <SelectItem value="mri">MRI Scan</SelectItem>
              <SelectItem value="prescription">Prescription</SelectItem>
              <SelectItem value="report">Medical Report</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {newRecords.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No medical records uploaded yet. Click "Upload Record" to get started.
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Record ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>File Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-mono text-sm font-medium">{record.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{record.patient}</p>
                          <p className="text-sm text-muted-foreground font-mono">{record.patientId}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{record.date}</TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm text-foreground truncate">{record.title}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <File className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{record.fileName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={typeColors[record.type as keyof typeof typeColors]}>
                          {record.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <RecordDetailDialog record={record} />
                            <DropdownMenuItem onClick={() => handleDownload(record)}>
                              <Download className="h-4 w-4 mr-2" />
                              Download File
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredRecords.length} of {newRecords.length} records
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
