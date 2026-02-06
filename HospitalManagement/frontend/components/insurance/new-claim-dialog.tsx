"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface NewClaimDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function NewClaimDialog({ open, onOpenChange, onSuccess }: NewClaimDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    patientId: "",
    provider: "",
    policyNumber: "",
    amount: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/insurance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Failed to create claim')

      toast.success("Insurance claim submitted successfully")
      onSuccess()
      onOpenChange(false)
      setFormData({ patientId: "", provider: "", policyNumber: "", amount: "" })
    } catch (error) {
      toast.error("Failed to submit claim")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New Insurance Claim</DialogTitle>
          <DialogDescription>Submit a new claim for processing.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patientId">Patient ID <span className="text-red-500">*</span></Label>
            <Input
              id="patientId"
              placeholder="UUID of Patient"
              required
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="provider">Insurance Provider <span className="text-red-500">*</span></Label>
            <Input
              id="provider"
              placeholder="e.g. Nib Insurance"
              required
              value={formData.provider}
              onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="policy">Policy Number <span className="text-red-500">*</span></Label>
            <Input
              id="policy"
              placeholder="Policy ID"
              required
              value={formData.policyNumber}
              onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Claim Amount (ETB) <span className="text-red-500">*</span></Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Claim
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
