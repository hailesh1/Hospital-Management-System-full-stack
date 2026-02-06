"use client"

import { useEffect, useState } from "react"
import { AppointmentsTable } from "@/components/appointments/appointments-table"
import { CreateAppointmentDialog } from "@/components/appointments/create-appointment-dialog"
import { DashboardCard } from "@/components/dashboard-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function AdminAppointmentsPage() {
    const [appointments, setAppointments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isAddOpen, setIsAddOpen] = useState(false)

    const fetchAppointments = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/appointments')
            if (response.ok) {
                const data = await response.json()
                setAppointments(data)
            }
        } catch (error) {
            console.error("Failed to fetch appointments:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAppointments()
    }, [])

    const handleAddAppointment = () => {
        fetchAppointments()
        setIsAddOpen(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl shadow-emerald-900/5 border border-emerald-50 dark:border-emerald-900/20">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white flex items-center">
                        Appointment Management
                        <span className="ml-3 px-3 py-1 bg-emerald-500 text-white text-xs rounded-full uppercase tracking-tighter animate-pulse">Live</span>
                    </h1>
                    <p className="text-lg font-medium text-muted-foreground mt-2">
                        View and manage all <span className="text-emerald-600 font-bold">patient appointments</span> today.
                    </p>
                </div>
                <Button
                    onClick={() => setIsAddOpen(true)}
                    className="bg-emerald-600 text-white hover:bg-emerald-700 font-black h-14 px-8 rounded-2xl shadow-xl shadow-emerald-200 transition-all hover:scale-105 active:scale-95 group"
                >
                    <Plus className="mr-3 h-5 w-5 transition-transform group-hover:rotate-90" />
                    Schedule Appointment
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard
                    title="Total Appointments"
                    value={appointments.length.toString()}
                    description="All time records"
                    icon="calendar"
                />
                <DashboardCard
                    title="Scheduled"
                    value={appointments.filter((a: any) => a.status === 'scheduled' || a.status === 'Scheduled').length.toString()}
                    description="Upcoming visits"
                    icon="calendarCheck"
                />
                <DashboardCard
                    title="Confirmed"
                    value={appointments.filter((a: any) => a.status === 'confirmed' || a.status === 'Confirmed').length.toString()}
                    description="Verified bookings"
                    icon="activity"
                />
                <DashboardCard
                    title="Completed"
                    value={appointments.filter((a: any) => a.status === 'completed' || a.status === 'Completed').length.toString()}
                    description="Successful visits"
                    icon="check"
                />
            </div>

            <AppointmentsTable appointments={appointments} />

            <CreateAppointmentDialog
                open={isAddOpen}
                onOpenChange={setIsAddOpen}
                onAddAppointment={handleAddAppointment}
            />
        </div>
    )
}
