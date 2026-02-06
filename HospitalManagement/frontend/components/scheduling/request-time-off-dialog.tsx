"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RequestTimeOffDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function RequestTimeOffDialog({ open, onOpenChange }: RequestTimeOffDialogProps) {
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [reason, setReason] = useState("")
    const [type, setType] = useState("vacation")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically send this to the backend
        alert("Time off request submitted successfully!")
        onOpenChange(false)

        // Reset form
        setStartDate("")
        setEndDate("")
        setReason("")
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Request Time Off</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="vacation">Vacation</SelectItem>
                                <SelectItem value="sick">Sick Leave</SelectItem>
                                <SelectItem value="personal">Personal Leave</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input id="startDate" type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input id="endDate" type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="reason">Reason</Label>
                        <Textarea id="reason" placeholder="Briefly describe why you are requesting time off..." value={reason} onChange={(e) => setReason(e.target.value)} />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit">Submit Request</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
