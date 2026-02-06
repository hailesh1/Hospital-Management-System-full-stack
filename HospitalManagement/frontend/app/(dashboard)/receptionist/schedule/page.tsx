"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function ReceptionistSchedulePage() {
  const [doctors, setDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/staff', { cache: 'no-store' })
      if (response.ok) {
        const data = await response.json()
        // Filter for DOCTOR role
        const docs = data.filter((s: any) =>
          s.role?.toLowerCase() === 'doctor' ||
          s.role?.toLowerCase() === 'specialist'
        )
        setDoctors(docs)
      }
    } catch (error) {
      console.error("Failed to fetch doctors:", error)
      toast.error("Failed to load doctor schedules")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  const handleStatusUpdate = async (id: string, currentStaff: any, newStatus: string) => {
    try {
      const response = await fetch(`/api/staff/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus
        })
      })

      if (response.ok) {
        toast.success(`Broadcasting status: ${newStatus}`)
        fetchDoctors() // Refresh list
      } else {
        throw new Error("Update failed")
      }
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase()
    if (s === 'active' || s === 'available') return 'bg-green-500'
    if (s === 'busy') return 'bg-red-500'
    if (s === 'aware' || s === 'on break' || s === 'in personal break') return 'bg-yellow-500'
    return 'bg-gray-400'
  }

  const availableCount = doctors.filter(d => d.status?.toLowerCase() === 'active' || d.status?.toLowerCase() === 'available').length
  const busyCount = doctors.filter(d => d.status?.toLowerCase() === 'busy' || d.status?.toLowerCase() === 'in personal break').length

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-xl border border-red-50">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900">Doctor Availability</h1>
          <p className="text-lg font-medium text-muted-foreground mt-2">
            Real-time shift management and specialist queue tracking.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="px-6 py-3 bg-red-50 rounded-2xl border-2 border-red-100">
            <span className="text-xs font-black uppercase text-red-900/40 block">Available Now</span>
            <span className="text-xl font-black text-red-600">{availableCount} Doctors</span>
          </div>
          <div className="px-6 py-3 bg-red-50 rounded-2xl border-2 border-red-100">
            <span className="text-xs font-black uppercase text-red-900/40 block">Busy/Away</span>
            <span className="text-xl font-black text-gray-400">{busyCount} Doctors</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 rounded-3xl bg-gray-100 animate-pulse" />
          ))
        ) : doctors.map((doc, i) => (
          <Card key={doc.id} className="group border-none shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-white overflow-hidden relative border-t-8 border-t-red-600">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="h-14 w-14 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 font-black group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
                  {(doc.first_name?.[0] || '') + (doc.last_name?.[0] || '')}
                </div>
                <Select
                  value={doc.status || 'Available'}
                  onValueChange={(val) => handleStatusUpdate(doc.id, doc, val)}
                >
                  <SelectTrigger className={cn("w-[140px] h-8 font-black uppercase text-[10px] tracking-tighter border-none focus:ring-0",
                    (doc.status === 'Available') ? 'text-green-600 bg-green-50' :
                      doc.status === 'Busy' ? 'text-red-600 bg-red-50' : 'text-gray-500 bg-gray-50'
                  )}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available" className="text-[10px] font-black text-green-600">AVAILABLE</SelectItem>
                    <SelectItem value="Busy" className="text-[10px] font-black text-red-600">BUSY</SelectItem>
                    <SelectItem value="In Personal Break" className="text-[10px] font-black text-gray-600">IN PERSONAL BREAK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CardTitle className="text-lg font-black mt-4 group-hover:text-red-600 transition-colors tracking-tight">
                DR {doc.first_name} {doc.last_name}
              </CardTitle>
              <p className="text-xs font-bold text-red-900/40 uppercase tracking-[0.2em]">{doc.specialization || 'General Med'}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-muted-foreground uppercase text-[10px] tracking-widest">Active Status</span>
                <Badge className={cn("font-black uppercase tracking-tighter", getStatusColor(doc.status))}>
                  {doc.status || 'Available'}
                </Badge>
              </div>
              <div className="flex items-center gap-3 p-4 bg-red-50/50 rounded-2xl border border-red-50 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                <Icons.phone className="h-4 w-4 text-red-600 group-hover:text-white" />
                <span className="text-xs font-black uppercase tracking-widest">{doc.phone}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
