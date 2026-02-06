"use client"

import { useState, useEffect } from "react"
import { AppointmentsTable } from "@/components/appointments/appointments-table"
import { BookAppointmentDialog } from "@/components/appointments/book-appointment-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export default function PatientAppointmentsPage() {
    const { user } = useAuth()
    const [appointments, setAppointments] = useState<any[]>([])

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!user?.id) return

            try {
                // Fetch appointments for the logged-in patient
                const res = await fetch(`/api/appointments?patient_id=${user.id}`)
                if (res.ok) {
                    const data = await res.json()
                    setAppointments(data)
                }
            } catch (error) {
                console.error("Failed to fetch appointments:", error)
            }
        }
        fetchAppointments()
    }, [user])

    const handleAddAppointment = (newAppointment: any) => {
        // optimistically add or re-fetch
        setAppointments(prev => [newAppointment, ...prev])
    }

    const nextAppointment = appointments
        .filter(a => new Date(a.appointment_date) > new Date())
        .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())[0];

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Appointments</h1>
                    <p className="text-muted-foreground">
                        Manage your past and upcoming medical visits.
                    </p>
                </div>
                <BookAppointmentDialog onAdd={handleAddAppointment} />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border-l-8 border-l-primary bg-gradient-to-br from-white to-primary/5 shadow-md">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center text-primary/80">
                            <Calendar className="mr-2 h-5 w-5 text-primary shadow-sm" />
                            Next Appointment
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-primary">
                            {nextAppointment 
                                ? new Date(nextAppointment.appointment_date).toLocaleDateString() 
                                : "No upcoming"}
                        </div>
                        <p className="text-xs font-semibold text-primary/70 mt-1 uppercase tracking-wider">
                            {nextAppointment 
                                ? `${new Date(nextAppointment.appointment_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • ${nextAppointment.doctor_name || 'Doctor'}`
                                : "Book a visit today"}
                        </p>
                    </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border-l-8 border-l-primary bg-gradient-to-br from-white to-primary/5 shadow-md">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center text-primary/80">
                            <Clock className="mr-2 h-5 w-5 text-primary shadow-sm" />
                            Confirmed Visits
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-primary">{appointments.filter(a => a.status === 'confirmed' || a.status === 'scheduled').length}</div>
                        <p className="text-xs font-semibold text-primary/70 mt-1 uppercase tracking-wider">Scheduled for upcoming weeks</p>
                    </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border-l-8 border-l-primary bg-gradient-to-br from-white to-primary/5 shadow-md">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center text-primary/80">
                            <Filter className="mr-2 h-5 w-5 text-primary shadow-sm" />
                            Total Appointments
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-primary">{appointments.length}</div>
                        <p className="text-xs font-semibold text-primary/70 mt-1 uppercase tracking-wider">Total in your medical history</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-xl overflow-hidden bg-white/80 backdrop-blur-xl ring-1 ring-primary/10">
                <CardHeader className="bg-primary pb-4 border-b border-primary/20">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold text-white">Appointment History</CardTitle>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-8 bg-white/10 text-white border-white/20 hover:bg-white/20">Filter</Button>
                            <Button variant="outline" size="sm" className="h-8 bg-white/10 text-white border-white/20 hover:bg-white/20">Export</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <AppointmentsTable appointments={appointments} />
                </CardContent>
            </Card>
        </div>
    )
}
