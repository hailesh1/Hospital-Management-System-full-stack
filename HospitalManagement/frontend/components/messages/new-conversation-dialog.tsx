"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface NewConversationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function NewConversationDialog({ open, onOpenChange }: NewConversationDialogProps) {
    const [loading, setLoading] = useState(false)
    const [role, setRole] = useState("")
    const [recipients, setRecipients] = useState<any[]>([])
    const [selectedRecipient, setSelectedRecipient] = useState("")
    const [message, setMessage] = useState("")

    useEffect(() => {
        if (role) {
            // Fetch recipients based on role
            fetch(`/api/messages?type=recipients&role=${role}`)
                .then(res => res.json())
                .then(data => setRecipients(data))
                .catch(err => console.error(err))
        }
    }, [role])

    const handleSend = async () => {
        if (!selectedRecipient || !message) return
        setLoading(true)

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    receiverId: selectedRecipient,
                    receiverRole: role,
                    content: message
                })
            })

            if (!res.ok) throw new Error('Failed to send message')

            toast.success("Message sent successfully")
            onOpenChange(false)
            setRole("")
            setMessage("")
            setSelectedRecipient("")
        } catch (error) {
            toast.error("Failed to send message")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>New Conversation</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Recipient Role <span className="text-red-500">*</span></Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DOCTOR">Doctor</SelectItem>
                                <SelectItem value="ADMIN">Admin / Staff</SelectItem>
                                <SelectItem value="PATIENT">Patient</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {role && (
                        <div className="space-y-2">
                            <Label>Select Recipient <span className="text-red-500">*</span></Label>
                            <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                                <SelectTrigger>
                                    <SelectValue placeholder={`Choose ${role.toLowerCase()}...`} />
                                </SelectTrigger>
                                <SelectContent>
                                    {recipients.map((r: any) => (
                                        <SelectItem key={r.id} value={r.id}>{r.label}</SelectItem>
                                    ))}
                                    {recipients.length === 0 && <div className="p-2 text-sm text-muted-foreground">No recipients found</div>}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Message <span className="text-red-500">*</span></Label>
                        <Textarea
                            placeholder="Type your message here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSend} disabled={loading || !selectedRecipient} className="bg-red-600 hover:bg-red-700 text-white">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send Message
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
