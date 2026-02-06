"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export function DoctorStatusSelector() {
    const { user } = useAuth()
    const [status, setStatus] = useState("Available")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // Fetch initial status if needed, or assume default/from auth
        // Ideally we fetch the real status from DB on mount
        const fetchStatus = async () => {
            if (user?.id) {
                try {
                    // We can re-use the doctor fetch or just rely on what we have. 
                    // For now, let's just set a default or fetch if we had a specific "me" endpoint.
                    // Let's assume we start with "Available" or fetch from a 'get-status' logic if we want perfection.
                } catch (e) {
                    console.error(e)
                }
            }
        }
        fetchStatus()
    }, [user?.id])

    const handleStatusChange = async (newStatus: string) => {
        if (!user?.id) return

        setLoading(true)
        setStatus(newStatus) // Optimistic update

        try {
            const response = await fetch(`/api/staff/${user.id}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || "Failed to update status")
            }
        } catch (error) {
            console.error(error)
            // Revert on error?
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (val: string) => {
        switch (val) {
            case "Available": return "bg-green-500 hover:bg-green-600 border-green-600 text-white"
            case "Busy": return "bg-red-500 hover:bg-red-600 border-red-600 text-white"
            case "In Personal Break": return "bg-yellow-500 hover:bg-yellow-600 border-yellow-600 text-white"
            default: return "bg-gray-500"
        }
    }

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground hidden md:inline-block">Status:</span>
            <Select value={status} onValueChange={handleStatusChange} disabled={loading}>
                <SelectTrigger className={`w-[160px] h-8 ${getStatusColor(status)} border-0 focus:ring-1 focus:ring-offset-1 transition-all duration-200`}>
                    <SelectValue>{status}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Busy">Busy</SelectItem>
                    <SelectItem value="In Personal Break">In Personal Break</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
