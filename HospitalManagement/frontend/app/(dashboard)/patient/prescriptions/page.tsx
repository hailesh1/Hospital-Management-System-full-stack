"use client"

import { useState, useEffect } from "react"
import { PrescriptionsTable } from "@/components/lab/prescriptions-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pill, Activity, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import type { Prescription } from "@/types"

export default function PatientPrescriptionsPage() {
    const { user } = useAuth()
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchPrescriptions = async () => {
            if (!user?.id) return

            try {
                const res = await fetch(`/api/prescriptions?patientId=${user.id}`)
                if (res.ok) {
                    const data = await res.json()
                    setPrescriptions(data)
                }
            } catch (error) {
                console.error("Failed to fetch prescriptions:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPrescriptions()
    }, [user])


    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Prescriptions</h1>
                <p className="text-muted-foreground">
                    View your active and past medications prescribed by your doctors.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] cursor-pointer hover:border-emerald-500 hover:shadow-emerald-500/20 group relative overflow-hidden border-l-8 border-l-primary bg-gradient-to-br from-white to-primary/5 shadow-lg ring-1 ring-primary/10">
                    <div className="absolute top-0 right-0 -m-2 w-12 h-12 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all duration-500" />
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity" />
                    <CardHeader className="pb-2 relative z-10">
                        <CardTitle className="text-sm font-black flex items-center text-primary/80 group-hover:text-emerald-700 transition-colors uppercase tracking-tighter">
                            <Pill className="mr-2 h-5 w-5 text-primary shadow-md" />
                            Active Medications
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-primary drop-shadow-sm">{prescriptions.filter(p => p.status === 'active').length}</div>
                        <p className="text-xs font-bold text-primary/70 mt-2">Currently being taken</p>
                    </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] cursor-pointer hover:border-emerald-500 hover:shadow-emerald-500/20 group relative overflow-hidden border-l-8 border-l-primary/80 hover:border-l-emerald-500 bg-gradient-to-br from-white to-primary/5 shadow-lg ring-1 ring-primary/10">
                    <div className="absolute top-0 right-0 -m-2 w-12 h-12 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all duration-500" />
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity" />
                    <CardHeader className="pb-2 relative z-10">
                        <CardTitle className="text-sm font-black flex items-center text-primary/80 group-hover:text-emerald-700 transition-colors uppercase tracking-tighter">
                            <Activity className="mr-2 h-5 w-5 text-primary/80 shadow-md" />
                            Refills Remaining
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-primary/80 drop-shadow-sm">5</div>
                        <p className="text-xs font-bold text-primary/70 mt-2">Across all prescriptions</p>
                    </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] cursor-pointer hover:border-emerald-500 hover:shadow-emerald-500/20 group relative overflow-hidden border-l-8 border-l-primary/60 hover:border-l-emerald-500 bg-gradient-to-br from-white to-primary/5 shadow-lg ring-1 ring-primary/10">
                    <div className="absolute top-0 right-0 -m-2 w-12 h-12 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all duration-500" />
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity" />
                    <CardHeader className="pb-2 relative z-10">
                        <CardTitle className="text-sm font-black flex items-center text-primary/80 group-hover:text-emerald-700 transition-colors uppercase tracking-tighter">
                            <AlertCircle className="mr-2 h-5 w-5 text-primary/60 shadow-md" />
                            Expiring Soon
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-primary/60 drop-shadow-sm">1</div>
                        <p className="text-xs font-bold text-primary/70 mt-2">Action required within 7 days</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-2xl overflow-hidden bg-white/90 backdrop-blur-xl ring-2 ring-primary/5">
                <CardHeader className="border-b border-primary/10 bg-primary px-6 py-4">
                    <CardTitle className="text-lg font-black text-white uppercase tracking-widest">Current Medications</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <PrescriptionsTable prescriptions={prescriptions} onUpdate={() => { }} />
                </CardContent>
            </Card>
        </div>
    )
}
