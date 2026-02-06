"use client"

import { useEffect, useState, useCallback } from "react"
import { StaffTable } from "@/components/staff/staff-table"
import { AddStaffDialog } from "@/components/staff/add-staff-dialog"
import { DashboardCard } from "@/components/dashboard-card"
import { toast } from "sonner"

export default function AdminStaffPage() {
    const [stats, setStats] = useState<any>(null)
    const [staff, setStaff] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchStaff = useCallback(async () => {
        setLoading(true)
        try {
            const [staffRes, statsRes] = await Promise.all([
                fetch('/api/staff'),
                fetch('/api/dashboard/stats')
            ])

            if (staffRes.ok) {
                const data = await staffRes.json()
                setStaff(data)
            }

            if (statsRes.ok) {
                const statData = await statsRes.json()
                setStats(statData)
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to load staff members")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchStaff()
    }, [fetchStaff])

    const handleAddStaff = () => {
        fetchStaff()
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl shadow-green-900/5 border border-green-50 dark:border-green-900/20">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white flex items-center">
                        Staff Management <span className="ml-3 px-3 py-1 bg-green-500 text-white text-xs rounded-full uppercase tracking-tighter animate-pulse">Live</span>
                    </h1>
                    <p className="text-lg font-medium text-muted-foreground mt-2">
                        Manage all <span className="text-green-600 font-bold">hospital staff</span>, roles, and permissions.
                    </p>
                </div>
                <AddStaffDialog onAddStaff={handleAddStaff} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard
                    title="Total Staff"
                    value={stats?.staff?.toString() || staff.length.toString()}
                    description="Registered employees"
                    icon="users"
                />
                <DashboardCard
                    title="Doctors"
                    value={(stats?.doctors || staff.filter((s: any) => s.role?.toUpperCase() === 'DOCTOR').length).toString()}
                    description="Medical specialists"
                    icon="stethoscope"
                />
                <DashboardCard
                    title="Nurses"
                    value={staff.filter((s: any) => s.role?.toUpperCase() === 'NURSE').length.toString()}
                    description="Support staff"
                    icon="activity"
                />
                <DashboardCard
                    title="Active Staff"
                    value={stats?.activeStaff?.toString() || "0"}
                    description="Successfully registered"
                    icon="clock"
                />
            </div>

            <StaffTable newStaff={staff} onUpdate={fetchStaff} />
        </div>
    )
}
