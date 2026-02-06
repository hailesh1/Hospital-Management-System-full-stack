"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"
import { CreateAppointmentDialog } from "@/components/appointments/create-appointment-dialog"
import { AppointmentCalendar } from "@/components/appointments/appointment-calendar"

import { EditAppointmentDialog } from "@/components/appointments/edit-appointment-dialog"

export default function ReceptionistAppointmentsPage() {
    const [appointments, setAppointments] = useState<any[]>([])
    const [view, setView] = useState<"list" | "calendar">("list")
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editingAppointment, setEditingAppointment] = useState<any>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)

    const fetchAppointments = async () => {
        try {
            const res = await fetch('/api/appointments')
            if (res.ok) {
                const data = await res.json()
                setAppointments(data)
            }
        } catch (error) {
            console.error("Failed to fetch appointments:", error)
        }
    }

    const handleAddAppointment = (newAppt: any) => {
        fetchAppointments()
        setIsAddOpen(false)
    }

    const handleUpdateAppointment = (updatedAppt: any) => {
        fetchAppointments()
        setIsEditOpen(false)
        setEditingAppointment(null)
    }

    const openEdit = (appt: any) => {
        setEditingAppointment(appt)
        setIsEditOpen(true)
    }

    const handleCheckIn = async (apptId: string) => {
        try {
            const res = await fetch(`/api/appointments/${apptId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'checked-in' })
            })
            if (res.ok) {
                fetchAppointments()
                import('sonner').then(({ toast }) => toast.success("Patient checked in successfully"))
            } else {
                import('sonner').then(({ toast }) => toast.error("Failed to check in"))
            }
        } catch (error) {
            console.error("Check in error:", error)
        }
    }

    useEffect(() => {
        fetchAppointments()
    }, [])

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-xl border border-red-50">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900">Master Schedule</h1>
                    <p className="text-lg font-medium text-muted-foreground mt-2">
                        Real-time management of all hospital appointments and walk-ins.
                    </p>
                </div>
                <div className="flex bg-red-50 p-1.5 rounded-2xl gap-1">
                    <Button
                        variant={view === "list" ? "destructive" : "ghost"}
                        className={cn("rounded-xl font-black transition-all", view === "list" ? "shadow-lg scale-105" : "text-red-900/60 hover:bg-red-100")}
                        onClick={() => setView("list")}
                    >
                        <Icons.list className="mr-2 h-4 w-4" /> List View
                    </Button>
                    <Button
                        variant={view === "calendar" ? "destructive" : "ghost"}
                        className={cn("rounded-xl font-black transition-all", view === "calendar" ? "shadow-lg scale-105" : "text-red-900/60 hover:bg-red-100")}
                        onClick={() => setView("calendar")}
                    >
                        <Icons.calendar className="mr-2 h-4 w-4" /> Calendar View
                    </Button>
                </div>
            </div>

            <Card className="border-none shadow-2xl overflow-hidden bg-white/50 backdrop-blur-xl ring-2 ring-primary/5">
                <CardHeader className="bg-primary p-8 border-b border-primary/20">
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                        <div className="flex items-center gap-4 bg-white/10 p-2 rounded-2xl border border-white/20">
                            <Button variant="ghost" className="text-white hover:bg-white/20 font-black h-10 px-4 rounded-xl">Today</Button>
                            <div className="flex items-center gap-2 text-white px-4 border-x border-white/20">
                                <Icons.chevronLeft className="h-5 w-5 cursor-pointer hover:scale-125 transition-transform" />
                                <span className="font-black tracking-tight text-lg">
                                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                                <Icons.chevronRight className="h-5 w-5 cursor-pointer hover:scale-125 transition-transform" />
                            </div>
                            <Button className="bg-white text-primary hover:bg-primary/5 font-black h-10 px-6 rounded-xl shadow-lg">Set Date</Button>
                        </div>
                        <CreateAppointmentDialog onAddAppointment={handleAddAppointment} />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {view === "list" ? (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-red-900/40 border-b border-red-50 bg-red-50/30">
                                        <th className="py-5 px-8">Time Slot</th>
                                        <th className="py-5 px-4">Patient Case</th>
                                        <th className="py-5 px-4">Doctor & Dept</th>
                                        <th className="py-5 px-4">Visit Type</th>
                                        <th className="py-5 px-4">Status</th>
                                        <th className="py-5 px-8 text-right">Control</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-red-50">
                                    {appointments.map((appt, i) => (
                                        <tr key={i} className="group hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
                                            <td className="py-6 px-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-3 bg-primary/5 group-hover:bg-white/20 rounded-xl text-primary group-hover:text-white transition-colors">
                                                        <Icons.clock className="h-5 w-5" />
                                                    </div>
                                                    <span className="text-lg font-black tracking-tighter group-hover:text-white">{appt.time}</span>
                                                </div>
                                            </td>
                                            <td className="py-6 px-4">
                                                <div className="text-sm font-black transition-colors">{appt.patient_name || appt.patientName || "Unknown"}</div>
                                                <div className="text-[10px] font-bold text-primary group-hover:text-red-100 uppercase tracking-widest mt-0.5">ID: P-{appt.patient_id}</div>
                                            </td>
                                            <td className="py-6 px-4">
                                                <div className="text-sm font-black opacity-80 group-hover:opacity-100">{appt.doctor_name || appt.doctorName || "Unassigned"}</div>
                                                <div className="text-[10px] font-black text-primary/60 group-hover:text-white/60 uppercase tracking-widest">{appt.specialization_name || "General"}</div>
                                            </td>
                                            <td className="py-6 px-4">
                                                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-tighter border-primary/20 group-hover:border-white group-hover:text-white group-hover:bg-white/10 transition-all">{appt.type}</Badge>
                                            </td>
                                            <td className="py-6 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn("h-3 w-3 rounded-full shadow-lg ring-2 ring-white",
                                                        appt.status === 'confirmed' ? 'bg-green-500' :
                                                            appt.status === 'waiting' ? 'bg-yellow-500 animate-pulse' : 'bg-primary')}
                                                    />
                                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80 group-hover:opacity-100">{appt.status}</span>
                                                </div>
                                            </td>
                                            <td className="py-6 px-8 text-right">
                                                <div className="flex items-center justify-end gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                                                    <Button
                                                        size="sm"
                                                        className="bg-white text-primary font-black h-9 rounded-lg hover:scale-105 shadow-sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleCheckIn(appt.id)
                                                        }}
                                                    >
                                                        Check In
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="bg-white/10 text-white border-white/20 h-9 rounded-lg hover:bg-white/20"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            openEdit(appt)
                                                        }}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-lg text-white hover:bg-primary/50">
                                                        <Icons.moreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-8">
                            <AppointmentCalendar />
                        </div>
                    )}
                </CardContent>
            </Card>

            <EditAppointmentDialog
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                appointment={editingAppointment}
                onUpdateAppointment={handleUpdateAppointment}
            />
        </div>
    )
}
