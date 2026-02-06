"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Invoice } from "@/types"
import { Download, CreditCard, XCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

interface InvoiceDetailDialogProps {
  invoice: Invoice
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (invoice: Invoice) => void
}

export function InvoiceDetailDialog({ invoice, open, onOpenChange, onUpdate }: InvoiceDetailDialogProps) {
  const { user } = useAuth()

  const handleUpdateStatus = async (newStatus: Invoice["status"]) => {
    try {
      // Use consolidated billing endpoint if possible, but keeping current if it works
      const res = await fetch(`/api/billing/${invoice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (res.ok) {
        const row = await res.json()
        const updatedInvoice: Invoice = {
          id: row.id,
          patientId: row.patient_id,
          patientName: row.patient_name || invoice.patientName,
          date: (row.created_at || row.date) ? new Date(row.created_at || row.date).toISOString().split('T')[0] : invoice.date,
          dueDate: row.due_date ? new Date(row.due_date).toISOString().split('T')[0] : invoice.dueDate,
          items: Array.isArray(row.items) ? row.items : (invoice.items || []),
          subtotal: Number(row.subtotal ?? row.total ?? invoice.subtotal ?? 0),
          tax: Number(row.tax ?? invoice.tax ?? 0),
          total: Number(row.total ?? invoice.total ?? 0),
          status: String(row.status || newStatus).toLowerCase() as Invoice["status"],
          paymentMethod: row.payment_method ?? invoice.paymentMethod,
          paidDate: row.paid_date ? new Date(row.paid_date).toISOString().split('T')[0] : invoice.paidDate
        }
        toast.success(`Invoice status updated to ${newStatus}`)
        onUpdate(updatedInvoice)
        onOpenChange(false)
      } else {
        throw new Error("Failed to update invoice")
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to update status")
    }
  }

  const handleMarkAsPaid = () => {
    handleUpdateStatus("paid")
  }

  const handleCancelInvoice = () => {
    handleUpdateStatus("cancelled")
  }

  const handleDownloadPDF = () => {
    // Generate a simple text representation for the demo
    const content = `INVOICE ${invoice.id}
    
HOSPITAL MANAGEMENT SYSTEM
--------------------------------
Patient: ${invoice.patientName}
Date: ${new Date(invoice.date).toLocaleDateString()}
Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}

ITEMS:
${(invoice.items || []).map(item => `- ${item.description}: ${item.quantity} x ETB${item.unitPrice.toFixed(2)
      } = ETB${item.total.toFixed(2)
      } `).join('\n')}

--------------------------------
Subtotal: ETB${invoice.subtotal.toFixed(2)}
Tax (15%): ETB${invoice.tax.toFixed(2)}
TOTAL: ETB${invoice.total.toFixed(2)}

Status: ${invoice.status.toUpperCase()}
${invoice.status?.toLowerCase() === 'paid' ? `Paid on: ${new Date(invoice.paidDate!).toLocaleDateString()} via ${invoice.paymentMethod} ` : ''}
    `

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `Invoice-${invoice.id}.txt` // Using .txt as we're generating text. For real PDF, need a library like jsPDF
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: Invoice["status"] | string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-500/10 text-green-500"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500"
      case "overdue":
        return "bg-red-500/10 text-red-500"
      case "cancelled":
        return "bg-gray-500/10 text-gray-500"
      case "in progress":
      case "in-progress":
        return "bg-blue-500/10 text-blue-500"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Invoice Details</DialogTitle>
            <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Invoice ID</p>
              <p className="font-semibold">{invoice.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Patient Name</p>
              <p className="font-semibold">{invoice.patientName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Invoice Date</p>
              <p className="font-semibold">{new Date(invoice.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Due Date</p>
              <p className="font-semibold">{new Date(invoice.dueDate).toLocaleDateString()}</p>
            </div>
          </div>

          <Separator />

          {/* Items */}
          <div>
            <h3 className="font-semibold mb-4">Invoice Items</h3>
            <div className="space-y-3">
              {invoice.items?.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium">{item.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} x ${item.unitPrice.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold">${item.total.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium">ETB {invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (15%):</span>
              <span className="font-medium">ETB {invoice.tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>ETB {invoice.total.toFixed(2)}</span>
            </div>
          </div>

          {invoice.status === "paid" && (
            <div className="bg-green-500/10 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">
                Payment received on {invoice.paidDate && new Date(invoice.paidDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-green-600">Method: {invoice.paymentMethod}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            {invoice.status !== "paid" && invoice.status !== "cancelled" && (
              <>
                {user?.role === 'admin' && (
                  <Button variant="destructive" onClick={handleCancelInvoice}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Invoice
                  </Button>
                )}
                <Button onClick={handleMarkAsPaid}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Mark as Paid
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
