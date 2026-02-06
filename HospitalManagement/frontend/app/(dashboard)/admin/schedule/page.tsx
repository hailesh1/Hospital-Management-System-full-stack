"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { AppointmentCalendar } from "@/components/appointments/appointment-calendar"

export default function AdminSchedulePage() {
    const [appointments, setAppointments] = useState<any[]>([])

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await fetch('/api/appointments')
                if (res.ok) {
                    const data = await res.json()
                    setAppointments(data)
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchAppointments()
    }, [])

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl border border-emerald-50">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white flex items-center">
                        Master Calendar <span className="ml-3 px-3 py-1 bg-emerald-500 text-white text-xs rounded-full uppercase tracking-tighter">Live View</span>
                    </h1>
                    <p className="text-lg font-medium text-muted-foreground mt-2">
                        Visualizing <span className="text-emerald-600 font-bold">all hospital activities</span> across all departments.
                    </p>
                </div>
            </div>

            <Card className="border-none shadow-2xl overflow-hidden bg-white/50 backdrop-blur-xl ring-2 ring-emerald-500/5">
                <CardHeader className="bg-emerald-600 p-8">
                    <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-4 bg-white/10 p-2 rounded-2xl border border-white/20">
                            <Button variant="ghost" className="text-white hover:bg-white/20 font-black h-10 px-4 rounded-xl">Month</Button>
                            <Button variant="ghost" className="text-white hover:bg-white/20 font-black h-10 px-4 rounded-xl">Week</Button>
                            <Button variant="ghost" className="text-white hover:bg-white/20 font-black h-10 px-4 rounded-xl">Day</Button>
                        </div>
                        <h2 className="text-2xl font-black">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-10 w-10 p-0 rounded-xl"><Icons.chevronLeft /></Button>
                            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-10 w-10 p-0 rounded-xl"><Icons.chevronRight /></Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <AppointmentCalendar appointments={appointments} />
                </CardContent>
            </Card>
        </div>
    )
}
