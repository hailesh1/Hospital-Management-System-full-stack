"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function AdminLabPage() {
    const [labs, setLabs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Fetch lab tests from API
        const fetchLabs = async () => {
            try {
                const res = await fetch('/api/medical-records') // Lab tests are often records
                if (res.ok) {
                    const data = await res.json()
                    setLabs(data.filter((r: any) =>
                        r.type?.toLowerCase().includes('lab') ||
                        r.type?.toLowerCase().includes('diag') ||
                        r.title?.toLowerCase().includes('lab') ||
                        r.title?.toLowerCase().includes('diag')
                    ))
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchLabs()
    }, [])

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl border border-emerald-50">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white flex items-center">
                        Diagnostics & Lab <span className="ml-3 px-3 py-1 bg-emerald-500 text-white text-xs rounded-full uppercase tracking-tighter">Analysis</span>
                    </h1>
                    <p className="text-lg font-medium text-muted-foreground mt-2">
                        Supervising all <span className="text-emerald-600 font-bold">medical investigations</span> and lab reports.
                    </p>
                </div>
            </div>

            <Card className="border-none shadow-2xl overflow-hidden bg-white">
                <CardHeader className="bg-emerald-600 p-8">
                    <div className="relative w-full md:max-w-md group">
                        <Icons.search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-200" />
                        <Input
                            placeholder="Search lab investigations..."
                            className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-emerald-100 rounded-xl font-bold"
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40 border-b border-emerald-50 bg-emerald-50/30">
                                    <th className="py-5 px-8">Test Name</th>
                                    <th className="py-5 px-4">Patient</th>
                                    <th className="py-5 px-4">Requesting Doctor</th>
                                    <th className="py-5 px-4">Date</th>
                                    <th className="py-5 px-4">Status</th>
                                    <th className="py-5 px-8 text-right">Audit</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-50">
                                {labs.length === 0 ? (
                                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No recent lab investigations found.</td></tr>
                                ) : labs.map((lab, i) => (
                                    <tr key={i} className="group hover:bg-emerald-600 hover:text-white transition-all cursor-pointer">
                                        <td className="py-6 px-8 font-black">{lab.title || lab.type}</td>
                                        <td className="py-6 px-4 font-bold">{lab.patient || lab.patient_id}</td>
                                        <td className="py-6 px-4 opacity-80">{lab.doctor_name || 'System Request'}</td>
                                        <td className="py-6 px-4">{lab.date ? new Date(lab.date).toLocaleDateString() : 'N/A'}</td>
                                        <td className="py-6 px-4">
                                            <Badge className="bg-blue-500">Completed</Badge>
                                        </td>
                                        <td className="py-6 px-8 text-right">
                                            <Button variant="ghost" size="sm" className="font-black text-emerald-600 group-hover:text-white">View Report</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
