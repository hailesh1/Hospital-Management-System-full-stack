"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download } from "lucide-react"
import type { Invoice } from "@/types"
import { useState } from "react"
import { InvoiceDetailDialog } from "./invoice-detail-dialog"

interface InvoicesTableProps {
  invoices: Invoice[]
  onUpdateInvoice: (invoice: Invoice) => void
}

export function InvoicesTable({ invoices, onUpdateInvoice }: InvoicesTableProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  const getStatusColor = (status: Invoice["status"] | string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "overdue":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      case "cancelled":
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
      case "in progress":
      case "in-progress":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      default:
        return "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }
  }

  const formatStatusLabel = (status?: string) => {
    if (!status) return ""
    const s = status.replace(/_/g, " ").toLowerCase()
    return s.replace(/\b\w/g, c => c.toUpperCase())
  }

  const handleDownload = (invoice: Invoice) => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF()

      // Header
      doc.setFontSize(22)
      doc.setTextColor(220, 38, 38)
      doc.text("INVOICE", 105, 20, { align: "center" })

      // Company info
      doc.setFontSize(10)
      doc.setTextColor(100)
      doc.text("Healthcare Management System", 20, 35)
      doc.text("123 Clinic Road, Addis Ababa", 20, 40)
      doc.text("Email: contact@healthcare.com", 20, 45)

      doc.setDrawColor(200)
      doc.line(20, 55, 190, 55)

      // Invoice info
      doc.setFontSize(12)
      doc.setTextColor(0)
      doc.setFont("helvetica", "bold")
      doc.text(`Invoice ID: ${invoice.id}`, 20, 65)
      doc.setFont("helvetica", "normal")
      doc.text(`Date: ${invoice.date || new Date().toLocaleDateString()}`, 140, 65)
      doc.text(`Due Date: ${invoice.dueDate || 'N/A'}`, 140, 72)

      doc.setFont("helvetica", "bold")
      doc.text("Bill To:", 20, 85)
      doc.setFont("helvetica", "normal")
      doc.text(invoice.patientName || (invoice as any).patient_name || "Unknown Patient", 20, 92)

      // Items Table
      doc.setDrawColor(200)
      doc.line(20, 105, 190, 105)
      doc.setFont("helvetica", "bold")
      doc.text("Description", 20, 112)
      doc.text("Amount", 160, 112)
      doc.line(20, 115, 190, 115)

      doc.setFont("helvetica", "normal")
      let y = 125
      const items = (invoice as any).items || []
      if (items.length > 0) {
        items.forEach((item: any) => {
          doc.text(item.description || "Service", 20, y)
          doc.text(`ETB ${(item.amount || 0).toLocaleString()}`, 160, y)
          y += 10
        })
      } else {
        doc.text("Total Health Services", 20, y)
        doc.text(`ETB ${(invoice.total || 0).toLocaleString()}`, 160, y)
        y += 10
      }

      doc.line(20, y, 190, y)
      y += 10
      doc.setFont("helvetica", "bold")
      doc.text("Total Amount:", 120, y)
      doc.text(`ETB ${(invoice.total || 0).toLocaleString()}`, 160, y)

      // Footer
      const pageHeight = doc.internal.pageSize.height
      doc.setFontSize(10)
      doc.setTextColor(150)
      doc.text("Thank you for choosing our services!", 105, pageHeight - 20, { align: "center" })

      // Save
      doc.save(`Invoice-${invoice.id}.pdf`)
    })
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No invoices found. Create your first invoice to get started.
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice ID</TableHead>
            <TableHead>Patient Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id} className="transition-all duration-300 hover:bg-red-600/[0.04] hover:shadow-inner cursor-pointer group">
              <TableCell className="font-black text-gray-900 group-hover:text-red-700">{invoice.id}</TableCell>
              <TableCell className="font-bold">{invoice.patientName || (invoice as any).patient_name || "Unknown Patient"}</TableCell>
              <TableCell className="font-medium">
                {invoice.date ? new Date(invoice.date).toLocaleDateString() : "N/A"}
              </TableCell>
              <TableCell className="font-medium">
                {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "N/A"}
              </TableCell>
              <TableCell className="font-black text-red-600 text-lg tracking-tighter">
                ETB {(invoice.total || 0).toLocaleString()}
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(invoice.status)}>{formatStatusLabel(invoice.status as string)}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" size="sm" className="font-bold text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm" onClick={() => setSelectedInvoice(invoice)}>
                    View Details
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDownload(invoice)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedInvoice && (
        <InvoiceDetailDialog
          invoice={selectedInvoice}
          open={!!selectedInvoice}
          onOpenChange={(open) => !open && setSelectedInvoice(null)}
          onUpdate={onUpdateInvoice}
        />
      )}
    </>
  )
}
