"use client"

import { useEffect, useState } from "react"
import { PatientsTable } from "@/components/patients/patients-table"
import { AddPatientDialog } from "@/components/patients/add-patient-dialog"
import { DashboardCard } from "@/components/dashboard-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function AdminPatientsPage() {
    const [stats, setStats] = useState<any>(null)
    const [patients, setPatients] = useState<any[]>([])
    const [isAddOpen, setIsAddOpen] = useState(false)

    const fetchData = async () => {
        try {
            const [patientsRes, statsRes] = await Promise.all([
                fetch('/api/patients'),
                fetch('/api/dashboard/stats')
            ])

            if (patientsRes.ok) {
                const data = await patientsRes.json()
                setPatients(Array.isArray(data) ? data : [])
            }

            if (statsRes.ok) {
                const statData = await statsRes.json()
                setStats(statData)
            }
        } catch (error) {
            console.error("Failed to fetch data:", error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleUpdatePatient = (updated: any) => {
        setPatients(patients.map((p: any) => p.id === updated.id ? updated : p))
    }

    const handleAddPatient = (newPatient: any) => {
        // Refresh list to ensure we have the latest data including server-generated fields
        fetchData()
        setIsAddOpen(false)
    }

    const handleDeletePatient = async (id: string) => {
        try {
            const res = await fetch(`/api/patients?id=${id}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                // Remove from local state immediately
                setPatients(patients.filter(p => p.id !== id))
                // Refresh stats
                fetchData()
            } else {
                console.error("Failed to delete patient")
            }
        } catch (error) {
            console.error("Error deleting patient:", error)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl shadow-green-900/5 border border-green-50 dark:border-green-900/20">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white flex items-center">
                        Patient Management <span className="ml-3 px-3 py-1 bg-green-500 text-white text-xs rounded-full uppercase tracking-tighter animate-pulse">Live</span>
                    </h1>
                    <p className="text-lg font-medium text-muted-foreground mt-2">
                        Manage <span className="text-green-600 font-bold">patient records</span>, admissions, and history.
                    </p>
                </div>
                <Button
                    onClick={() => setIsAddOpen(true)}
                    className="bg-green-600 text-white hover:bg-green-700 font-black h-14 px-8 rounded-2xl shadow-xl shadow-green-200 transition-all hover:scale-105 active:scale-95 group"
                >
                    <Plus className="mr-3 h-5 w-5 transition-transform group-hover:rotate-90" />
                    Add New Patient
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard
                    title="Total Patients"
                    value={stats?.patients?.toString() || patients.length.toString()}
                    description="Registered in system"
                    icon="users"
                />
                <DashboardCard
                    title="Active"
                    value={stats?.activePatients?.toString() || "0"}
                    description="Current treatments"
                    icon="activity"
                />
                <DashboardCard
                    title="New Today"
                    value={stats?.newToday?.toString() || "0"}
                    description="Latest registrations"
                    icon="userPlus"
                />
                <DashboardCard
                    title="Outpatients"
                    value={stats?.outpatients?.toString() || "0"}
                    description="Clinic visitors"
                    icon="calendar"
                />
            </div>

            <PatientsTable
                newPatients={patients}
                onPatientUpdated={handleUpdatePatient}
                onPatientDeleted={handleDeletePatient}
                enableDelete={true}
            />

            <AddPatientDialog open={isAddOpen} onOpenChange={setIsAddOpen} onPatientAdded={handleAddPatient} />
        </div>
    )
}
