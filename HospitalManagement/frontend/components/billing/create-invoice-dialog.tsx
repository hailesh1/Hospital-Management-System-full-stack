"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import type { Invoice, Patient } from "@/types"
import { Plus, Trash2 } from "lucide-react"

interface CreateInvoiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (invoice: Invoice) => void
}

export function CreateInvoiceDialog({ open, onOpenChange, onAdd }: CreateInvoiceDialogProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [items, setItems] = useState([{ description: "", quantity: 1, unitPrice: 0, total: 0 }])

  useEffect(() => {
    if (open) {
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
    }
  }, [open])

  const handleAddItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0, total: 0 }])
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const updatedItems = [...items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    if (field === "quantity" || field === "unitPrice") {
      updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitPrice
    }

    setItems(updatedItems)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const patient = patients.find((p) => p.id.toString() === selectedPatientId.toString())
    if (!patient) {
      console.error("Patient not found. Selected ID:", selectedPatientId, "Available patients:", patients)
      return
    }

    const subtotal = items.reduce((sum, item) => sum + item.total, 0)
    const tax = subtotal * 0.15 // 15% tax
    const total = subtotal + tax

    const payload = {
      patientId: patient.id,
      patientName: patient.name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim(),
      date: new Date().toISOString().split("T")[0],
      dueDate,
      items,
      subtotal,
      tax,
      total,
      status: "pending",
    }

    try {
      console.log("Creating invoice with payload:", payload)

      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        const savedInvoice = await res.json()
        console.log("Invoice created successfully:", savedInvoice)
        onAdd(savedInvoice) // Trigger refresh in parent

        // Reset form
        setSelectedPatientId("")
        setDueDate("")
        setItems([{ description: "", quantity: 1, unitPrice: 0, total: 0 }])
        onOpenChange(false) // Close dialog
      } else {
        const err = await res.json()
        console.error("Failed to create invoice:", err)
        alert(`Failed to create invoice: ${err.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error("Error creating invoice:", error)
      alert(`Error creating invoice: ${error.message}`)
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const tax = subtotal * 0.15
  const total = subtotal + tax

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
                    patients.map((patient) => {
                      const displayName = patient.name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim()
                      return (
                        <SelectItem key={patient.id} value={patient.id.toString()}>
                          {displayName}
                        </SelectItem>
                      )
                    })
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Invoice Items</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-5 space-y-2">
                  <Label>Description</Label>
                  <Input
                    placeholder="Service/Item description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, "description", e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Qty</Label>
                  <Input
                    type="number"
                    min="1"
                    value={Number.isNaN(item.quantity) ? "" : item.quantity}
                    onChange={(e) => {
                      const val = e.target.value === "" ? 1 : Number.parseInt(e.target.value)
                      handleItemChange(index, "quantity", Number.isNaN(val) ? 1 : val)
                    }}
                    required
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Price</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={Number.isNaN(item.unitPrice) ? "" : item.unitPrice}
                    onChange={(e) => {
                      const val = e.target.value === "" ? 0 : Number.parseFloat(e.target.value)
                      handleItemChange(index, "unitPrice", Number.isNaN(val) ? 0 : val)
                    }}
                    required
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Total</Label>
                  <Input value={`ETB ${item.total.toFixed(2)}`} disabled />
                </div>
                <div className="col-span-1">
                  {items.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveItem(index)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium">ETB {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (15%):</span>
              <span className="font-medium">ETB {tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>ETB {total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Invoice</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
