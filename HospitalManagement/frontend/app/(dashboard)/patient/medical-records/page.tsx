"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, Activity, Stethoscope } from "lucide-react"
import { Icons } from "@/components/ui/icons"
import { useAuth } from "@/contexts/auth-context"
import { useState, useEffect } from "react"
import { RecordDetailDialog } from "@/components/records/record-detail-dialog"

export default function PatientRecordsPage() {
    const { user } = useAuth()
    const [records, setRecords] = useState<any[]>([])
    const [selectedRecord, setSelectedRecord] = useState<any>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchRecords = async () => {
            if (!user?.id) return
            
            try {
                const res = await fetch(`/api/medical-records?patientId=${user.id}`)
                if (res.ok) {
                    const data = await res.json()
                    setRecords(data)
                }
            } catch (error) {
                console.error("Failed to fetch medical records:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchRecords()
    }, [user])

    const handleViewDetails = (record: any) => {
        setSelectedRecord(record)
        setIsDetailOpen(true)
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Medical Records</h1>
                <p className="text-muted-foreground">
                    Your complete medical history, visit logs, and diagnosis timeline.
                </p>
            </div>

            <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-muted">
                {records.map((record, i) => (
                    <div key={i} className="relative">
                        <div className="absolute -left-10 top-1.5 h-6 w-6 rounded-full border-4 border-background bg-primary flex items-center justify-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                        </div>

                        <Card className="transition-all duration-500 hover:shadow-2xl hover:translate-x-2 hover:bg-red-600/[0.02] hover:border-red-600 border-l-8 border-l-red-600 shadow-xl overflow-hidden bg-white/80 backdrop-blur-md relative">
                            <CardHeader className="flex flex-row items-center justify-between pb-4 bg-red-600/5 px-6">
                                <div className="space-y-1">
                                    <div className="flex items-center text-sm font-black text-red-600 uppercase tracking-widest">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {new Date(record.date).toLocaleDateString()}
                                    </div>
                                    <CardTitle className="text-2xl font-black text-gray-900 tracking-tighter">{record.title}</CardTitle>
                                </div>
                                <Badge variant="outline" className="bg-red-600 text-white border-red-700 font-black px-3 py-1 shadow-sm">
                                    {(record.status || 'completed').toUpperCase()}
                                </Badge>
                            </CardHeader>
                            <CardContent className="pt-6 grid md:grid-cols-2 gap-8 px-6">
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-red-50 transition-colors">
                                        <div className="p-3 bg-red-100 rounded-2xl shadow-inner">
                                            <Stethoscope className="h-6 w-6 text-red-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{record.doctor || 'Unknown Doctor'}</p>
                                            <p className="text-xs font-bold text-red-700/60">{record.department || 'General Medicine'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-red-50 transition-colors">
                                        <div className="p-3 bg-red-100 rounded-2xl shadow-inner">
                                            <Activity className="h-6 w-6 text-red-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Diagnosis</p>
                                            <p className="text-sm font-bold text-red-800">{record.diagnosis}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-red-50 transition-colors">
                                        <div className="p-3 bg-red-100 rounded-2xl shadow-inner">
                                            <FileText className="h-6 w-6 text-red-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Treatment Plan</p>
                                            <p className="text-sm font-bold text-red-800">{record.treatment}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleViewDetails(record)}
                                        className="w-full text-center py-3 rounded-xl font-black text-white bg-red-600 hover:bg-red-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 group uppercase tracking-widest text-xs"
                                    >
                                        View Full Medical Report
                                        <Icons.arrowRight className="inline ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>

            {selectedRecord && (
                <RecordDetailDialog
                    record={selectedRecord}
                    open={isDetailOpen}
                    onOpenChange={setIsDetailOpen}
                />
            )}
        </div>
    )
}
