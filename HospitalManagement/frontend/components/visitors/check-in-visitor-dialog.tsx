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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface CheckInVisitorDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onCheckIn: (visitor: any) => void
}

export function CheckInVisitorDialog({ open, onOpenChange, onCheckIn }: CheckInVisitorDialogProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        purpose: "",
        target: "",
        notes: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800))

        const newVisitor = {
            name: formData.name,
            purpose: formData.purpose,
            target: formData.target,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: "In Facility"
        }

        onCheckIn(newVisitor)
        setLoading(false)
        onOpenChange(false)
        setFormData({ name: "", purpose: "", target: "", notes: "" })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Check In Visitor</DialogTitle>
                    <DialogDescription>
                        Record visitor details for security logging.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="visitor-name">Visitor Name</Label>
                        <Input
                            id="visitor-name"
                            placeholder="Full Name and ID#"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="purpose">Purpose of Visit</Label>
                        <Select
                            value={formData.purpose}
                            onValueChange={(val) => setFormData({ ...formData, purpose: val })}
                            required
                        >
                            <SelectTrigger id="purpose">
                                <SelectValue placeholder="Select purpose" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Visiting Patient">Visiting Patient</SelectItem>
                                <SelectItem value="Appointment">Medical Appointment</SelectItem>
                                <SelectItem value="Maintenance">Maintenance / Contractor</SelectItem>
                                <SelectItem value="Delivery">Delivery / Logistics</SelectItem>
                                <SelectItem value="Staff Visit">Official Staff Visit</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="target">Visiting Who/Where?</Label>
                        <Input
                            id="target"
                            placeholder="Patient Name, Room #, or Department"
                            required
                            value={formData.target}
                            onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            placeholder="Additional details..."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Complete Check-In
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
