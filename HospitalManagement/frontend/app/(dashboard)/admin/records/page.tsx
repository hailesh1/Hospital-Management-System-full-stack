"use client"

import { useEffect, useState } from "react"
import { MedicalRecordsTable } from "@/components/records/medical-records-table"
import { UploadRecordDialog } from "@/components/records/upload-record-dialog"
import { DashboardCard } from "@/components/dashboard-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function AdminRecordsPage() {
    const [records, setRecords] = useState<any[]>([])
    const [isUploadOpen, setIsUploadOpen] = useState(false)

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const res = await fetch('/api/medical-records')
                if (res.ok) {
                    const data = await res.json()
                    setRecords(data)
                }
            } catch (error) {
                console.error("Failed to fetch medical records:", error)
            }
        }
        fetchRecords()
    }, [])

    const handleUpload = (newRecord: any) => {
        setRecords(prev => [newRecord, ...prev])
        setIsUploadOpen(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl shadow-green-900/5 border border-green-50 dark:border-green-900/20">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white flex items-center">
                        Medical Records <span className="ml-3 px-3 py-1 bg-green-500 text-white text-xs rounded-full uppercase tracking-tighter animate-pulse">Live</span>
                    </h1>
                    <p className="text-lg font-medium text-muted-foreground mt-2">
                        Centralized database of all <span className="text-green-600 font-bold">patient history</span> and reports.
                    </p>
                </div>
                <Button
                    onClick={() => setIsUploadOpen(true)}
                    className="bg-green-600 text-white hover:bg-green-700 font-black h-14 px-8 rounded-2xl shadow-xl shadow-green-200 transition-all hover:scale-105 active:scale-95 group"
                >
                    <Plus className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" />
                    Upload Record
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard
                    title="Total Records"
                    value={records.length.toString()}
                    description="Medical history files"
                    icon="fileText"
                />
                <DashboardCard
                    title="Lab Reports"
                    value={records.filter((r: any) => r.type === 'lab' || r.type === 'Lab Result').length.toString()}
                    description="Diagnostic insights"
                    icon="flaskConical"
                />
                <DashboardCard
                    title="Prescriptions"
                    value={records.filter((r: any) => r.type === 'prescription' || r.type === 'Prescription').length.toString()}
                    description="Medication orders"
                    icon="pill"
                />
                <DashboardCard
                    title="Recent Uploads"
                    value={records.filter((r: any) => new Date(r.uploadedAt || r.date).toDateString() === new Date().toDateString()).length.toString()}
                    description="Added today"
                    icon="activity"
                />
            </div>

            <MedicalRecordsTable newRecords={records} />

            <UploadRecordDialog
                open={isUploadOpen}
                onOpenChange={setIsUploadOpen}
                onUploadRecord={handleUpload}
            />
        </div>
    )
}
