"use client"

import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FlaskConical } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface OrderLabTestDialogProps {
  appointment: any
  onLabTestOrdered?: (labTest: any) => void
}

export function OrderLabTestDialog({ appointment, onLabTestOrdered }: OrderLabTestDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    testName: "",
    testType: "blood",
    notes: "",
  })
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const patientId = appointment?.patientId || appointment?.patient_id || ""

      if (!patientId) {
        throw new Error("Please select a patient")
      }

      const payload = {
        patientId,
        orderedBy: user?.name || appointment?.doctor || appointment?.doctor_name,
        doctorId: user?.id,
        ...formData,
      }

      const response = await fetch('/api/lab-tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const bodyText = await response.text()
        let defaultMsg = 'Failed to order lab test'
        try {
          const err = JSON.parse(bodyText)
          const msg = err?.error || defaultMsg
          const details = err?.details ? `\nDetails: ${err.details}` : ''
          const code = err?.code ? `\nCode: ${err.code}` : ''
          throw new Error(`${msg}${details}${code}`)
        } catch {
          throw new Error(bodyText || defaultMsg)
        }
      }

      const newLabTest = await response.json()
      
      if (onLabTestOrdered) {
        onLabTestOrdered(newLabTest)
      }

      setOpen(false)
      setFormData({
        testName: "",
        testType: "blood",
        notes: "",
      })
      alert("Lab test ordered successfully")
    } catch (error: any) {
      console.error("Error ordering lab test:", error)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2 bg-teal-600 hover:bg-teal-700 text-white">
          <FlaskConical className="h-4 w-4" />
          Order Lab Test
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order Lab Test</DialogTitle>
          <DialogDescription>
            Order a lab test for {appointment?.patient || appointment?.patient_name || "selected patient"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="testName">Test Name</Label>
            <Input
              id="testName"
              value={formData.testName}
              onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
              required
              placeholder="e.g. CBC, Lipid Profile"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="testType">Test Type</Label>
            <Select 
              value={formData.testType} 
              onValueChange={(value) => setFormData({ ...formData, testType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blood">Blood Test</SelectItem>
                <SelectItem value="urine">Urine Test</SelectItem>
                <SelectItem value="imaging">Imaging (X-Ray, MRI)</SelectItem>
                <SelectItem value="biopsy">Biopsy</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Clinical indications..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Ordering..." : "Order Test"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
