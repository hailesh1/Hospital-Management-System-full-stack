"use client"

import { useState, useEffect } from "react"
import { LabTestsTable } from "@/components/lab/lab-tests-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Microscope, FileCheck, FlaskConical } from "lucide-react"
import type { LabTest } from "@/types"

export default function PatientLabResultsPage() {
    const [labTests, setLabTests] = useState<LabTest[]>([])

    useEffect(() => {
        const loadedTests = JSON.parse(localStorage.getItem("labTests") || "[]")

        // Seed for John Doe if empty
        if (loadedTests.length === 0) {
            const mockTests: LabTest[] = [
                {
                    id: "L-001",
                    patientId: "P-0001",
                    patientName: "Dawit Alemu",
                    testName: "Complete Blood Count",
                    testType: "blood",
                    orderedBy: "Dr. Hiwot Kebede",
                    orderedDate: "2024-03-18",
                    status: "completed",
                    notes: "All values within normal range"
                },
                {
                    id: "L-002",
                    patientId: "P-0001",
                    patientName: "Dawit Alemu",
                    testName: "Lipid Profile",
                    testType: "blood",
                    orderedBy: "Dr. Hiwot Kebede",
                    orderedDate: "2024-03-24",
                    status: "ordered"
                }
            ]
            setLabTests(mockTests)
            localStorage.setItem("labTests", JSON.stringify(mockTests))
        } else {
            setLabTests(loadedTests.filter((t: any) => t.patientName === "Dawit Alemu" || t.patientId === "P-0001"))
        }
    }, [])

    const handleUpdate = (updated: LabTest) => {
        const updatedList = labTests.map(t => t.id === updated.id ? updated : t)
        setLabTests(updatedList)

        const all = JSON.parse(localStorage.getItem("labTests") || "[]")
        localStorage.setItem("labTests", JSON.stringify(all.map((t: any) => t.id === updated.id ? updated : t)))
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Lab Results</h1>
                <p className="text-muted-foreground">
                    View and download your laboratory test reports.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] cursor-pointer hover:border-emerald-500 hover:shadow-emerald-500/20 group relative overflow-hidden border-l-8 border-l-primary bg-gradient-to-br from-white to-primary/5 shadow-lg ring-1 ring-primary/10">
                    <div className="absolute top-0 right-0 -m-2 w-12 h-12 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all duration-500" />
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity" />
                    <CardHeader className="pb-2 relative z-10">
                        <CardTitle className="text-sm font-black flex items-center text-primary/80 group-hover:text-emerald-700 transition-colors uppercase tracking-tighter">
                            <Microscope className="mr-2 h-5 w-5 text-primary shadow-md" />
                            Total Tests
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-primary drop-shadow-sm">{labTests.length}</div>
                        <p className="text-xs font-bold text-primary/70 mt-2">Medical tests ordered</p>
                    </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] cursor-pointer hover:border-emerald-500 hover:shadow-emerald-500/20 group relative overflow-hidden border-l-8 border-l-primary/80 hover:border-l-emerald-500 bg-gradient-to-br from-white to-primary/5 shadow-lg ring-1 ring-primary/10">
                    <div className="absolute top-0 right-0 -m-2 w-12 h-12 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all duration-500" />
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity" />
                    <CardHeader className="pb-2 relative z-10">
                        <CardTitle className="text-sm font-black flex items-center text-primary/80 group-hover:text-emerald-700 transition-colors uppercase tracking-tighter">
                            <FileCheck className="mr-2 h-5 w-5 text-primary/80 shadow-md" />
                            Completed Results
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-primary/80 drop-shadow-sm">{labTests.filter(t => t.status === 'completed').length}</div>
                        <p className="text-xs font-bold text-primary/70 mt-2">Ready for your review</p>
                    </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] cursor-pointer hover:border-emerald-500 hover:shadow-emerald-500/20 group relative overflow-hidden border-l-8 border-l-primary/60 hover:border-l-emerald-500 bg-gradient-to-br from-white to-primary/5 shadow-lg ring-1 ring-primary/10">
                    <div className="absolute top-0 right-0 -m-2 w-12 h-12 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all duration-500" />
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity" />
                    <CardHeader className="pb-2 relative z-10">
                        <CardTitle className="text-sm font-black flex items-center text-primary/80 group-hover:text-emerald-700 transition-colors uppercase tracking-tighter">
                            <FlaskConical className="mr-2 h-5 w-5 text-primary/60 shadow-md" />
                            Pending Analysis
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-primary/60 drop-shadow-sm">{labTests.filter(t => t.status !== 'completed' && t.status !== 'cancelled').length}</div>
                        <p className="text-xs font-bold text-primary/70 mt-2">In progress at the lab</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-2xl overflow-hidden bg-white/90 backdrop-blur-xl ring-2 ring-primary/5">
                <CardHeader className="border-b border-primary/10 bg-primary px-6 py-4">
                    <CardTitle className="text-lg font-black text-white uppercase tracking-widest">Laboratory Test History</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <LabTestsTable tests={labTests} onUpdate={handleUpdate} />
                </CardContent>
            </Card>
        </div>
    )
}
