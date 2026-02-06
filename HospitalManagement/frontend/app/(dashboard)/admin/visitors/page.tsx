"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function AdminVisitorsPage() {
    const [visitors, setVisitors] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Mock data or fetch from API
        setTimeout(() => {
            setVisitors([
                { id: 1, name: "Abebe Bikila", patient: "Dawit Alemu", relation: "Brother", checkIn: "09:00 AM", status: "Active" },
                { id: 2, name: "Sara Hagos", patient: "Chala Beyene", relation: "Wife", checkIn: "10:30 AM", status: "Checked Out" },
            ])
            setLoading(false)
        }, 500)
    }, [])

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl shadow-emerald-900/5 border border-emerald-50 dark:border-emerald-900/20">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white flex items-center">
                        Security & Visitors <span className="ml-3 px-3 py-1 bg-emerald-500 text-white text-xs rounded-full uppercase tracking-tighter">Auditing</span>
                    </h1>
                    <p className="text-lg font-medium text-muted-foreground mt-2">
                        Global tracking of <span className="text-emerald-600 font-bold">hospital access</span> and visitor logs.
                    </p>
                </div>
            </div>

            <Card className="border-none shadow-2xl overflow-hidden bg-white">
                <CardHeader className="bg-emerald-600 p-8">
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                        <div className="relative w-full md:max-w-md group">
                            <Icons.search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-200" />
                            <Input
                                placeholder="Search visitor logs..."
                                className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-emerald-100 rounded-xl font-bold"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40 border-b border-emerald-50 bg-emerald-50/30">
                                    <th className="py-5 px-8">Visitor Name</th>
                                    <th className="py-5 px-4">Visiting Patient</th>
                                    <th className="py-5 px-4">Relationship</th>
                                    <th className="py-5 px-4">Check In</th>
                                    <th className="py-5 px-4">Status</th>
                                    <th className="py-5 px-8 text-right">Control</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-50">
                                {visitors.map((v, i) => (
                                    <tr key={i} className="group hover:bg-emerald-600 hover:text-white transition-all cursor-pointer">
                                        <td className="py-6 px-8 font-black">{v.name}</td>
                                        <td className="py-6 px-4 font-bold">{v.patient}</td>
                                        <td className="py-6 px-4 opacity-80">{v.relation}</td>
                                        <td className="py-6 px-4 font-black">{v.checkIn}</td>
                                        <td className="py-6 px-4">
                                            <Badge className={v.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'}>{v.status}</Badge>
                                        </td>
                                        <td className="py-6 px-8 text-right">
                                            <Button variant="ghost" size="sm" className="font-black text-emerald-600 group-hover:text-white">View Details</Button>
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
