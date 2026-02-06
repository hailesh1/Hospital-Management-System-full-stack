"use client"

import { useEffect, useState } from "react"
import { StaffTable } from "@/components/staff/staff-table"
import { AddStaffDialog } from "@/components/staff/add-staff-dialog"
import { DashboardCard } from "@/components/dashboard-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function AdminDoctorsPage() {
    const [stats, setStats] = useState<any>(null)
    const [staff, setStaff] = useState<any[]>([])
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        setLoading(true)
        try {
            const [staffRes, statsRes] = await Promise.all([
                fetch('/api/staff'),
                fetch('/api/dashboard/stats')
            ])

            if (staffRes.ok) {
                const data = await staffRes.json()
                // Filter to only show doctors
                const doctors = data.filter((s: any) => s.role === 'DOCTOR' || s.role === 'doctor')
                setStaff(doctors)
            }

            if (statsRes.ok) {
                const statData = await statsRes.json()
                setStats(statData)
            }
        } catch (error) {
            console.error("Failed to fetch data:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleAddStaff = (newStaff: any) => {
        fetchData()
        setIsAddOpen(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl shadow-emerald-900/5 border border-emerald-50 dark:border-emerald-900/20">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white flex items-center">
                        Doctor Management <span className="ml-3 px-3 py-1 bg-emerald-500 text-white text-xs rounded-full uppercase tracking-tighter animate-pulse">Live</span>
                    </h1>
                    <p className="text-lg font-medium text-muted-foreground mt-2">
                        Manage <span className="text-emerald-600 font-bold">doctor profiles</span>, specializations, and availability.
                    </p>
                </div>
                <Button
                    onClick={() => setIsAddOpen(true)}
                    className="bg-emerald-600 text-white hover:bg-emerald-700 font-black h-14 px-8 rounded-2xl shadow-xl shadow-emerald-200 transition-all hover:scale-105 active:scale-95 group"
                >
                    <Plus className="mr-3 h-5 w-5 transition-transform group-hover:rotate-90" />
                    Add New Doctor
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard
                    title="Total Doctors"
                    value={stats?.doctors?.toString() || staff.length.toString()}
                    description="Medical practitioners"
                    icon="stethoscope"
                />
                <DashboardCard
                    title="Active Now"
                    value={stats?.activeDoctors?.toString() || "0"}
                    description="Currently available"
                    icon="activity"
                />
                <DashboardCard
                    title="On Leave"
                    value={staff.filter((s: any) => (s.status || "").toLowerCase() === 'on-leave').length.toString()}
                    description="Temporarily away"
                    icon="calendar"
                />
                <DashboardCard
                    title="Avg Rating"
                    value="4.8"
                    description="Patient satisfaction"
                    icon="users"
                />
            </div>

            <StaffTable newStaff={staff} onUpdate={fetchData} />

            {/* 
         Note: AddStaffDialog allows selecting any role. 
         Ideally we'd pass a "defaultRole='doctor'" prop, but for now user can select.
      */}
            <AddStaffDialog onAddStaff={handleAddStaff} />
        </div>
    )
}
