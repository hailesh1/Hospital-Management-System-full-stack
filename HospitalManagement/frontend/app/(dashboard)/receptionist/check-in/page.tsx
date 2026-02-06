"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

export default function ReceptionistCheckInPage() {
    const [search, setSearch] = useState("")

    return (
        <div className="space-y-8 max-w-[1200px] mx-auto pb-10">
            <div className="text-center bg-white p-12 rounded-[32px] shadow-2xl border border-primary/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

                <h1 className="text-5xl font-black tracking-tight text-gray-900 mb-4">Patient Arrival</h1>
                <p className="text-xl font-medium text-muted-foreground max-w-2xl mx-auto">
                    Search for a patient to start the check-in process and assign them to their scheduled doctor.
                </p>

                <div className="mt-12 relative max-w-2xl mx-auto group">
                    <Icons.search className="absolute left-6 top-1/2 -translate-y-1/2 h-8 w-8 text-primary group-focus-within:scale-110 transition-transform" />
                    <Input
                        placeholder="Scan ID or search by name..."
                        className="h-20 pl-20 pr-8 text-2xl font-black rounded-3xl border-2 border-primary/10 focus:border-primary focus:ring-primary/20 shadow-xl transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Card className="border-none shadow-2xl overflow-hidden bg-white group hover:scale-[1.02] transition-all duration-500 cursor-pointer border-l-8 border-l-primary">
                    <CardHeader className="bg-primary p-8 border-b border-primary/20">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black text-white px-2">Scheduled Check-in</h3>
                            <Icons.calendarCheck className="h-8 w-8 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <p className="text-muted-foreground font-medium mb-6">Patient has an active appointment for today.</p>
                        <div className="space-y-4">
                            {[
                                { name: "Abebe Bekele", initials: "AB", time: "10:00 AM", doctor: "Dr. Hiwot" },
                                { name: "Tariku Ayalew", initials: "TA", time: "11:30 AM", doctor: "Dr. Kebede" }
                            ].map((patient, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-primary/5 rounded-2xl border-2 border-primary/10 group-hover:border-primary transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center font-black">{patient.initials}</div>
                                        <div>
                                            <p className="font-black text-gray-900">{patient.name}</p>
                                            <p className="text-xs font-bold text-primary uppercase">{patient.time} • {patient.doctor}</p>
                                        </div>
                                    </div>
                                    <Button className="bg-primary text-white font-black rounded-xl h-10 px-6 hover:bg-primary/90">Verify</Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-2xl overflow-hidden bg-white group hover:scale-[1.02] transition-all duration-500 cursor-pointer border-l-8 border-l-primary/80">
                    <CardHeader className="bg-primary/80 p-8 border-b border-primary/90">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black text-white px-2">Emergency Arrival</h3>
                            <Icons.flame className="h-8 w-8 text-white animate-pulse" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 text-center py-16">
                        <div className="p-6 bg-primary/5 rounded-full inline-block mb-6">
                            <Icons.plusSquare className="h-12 w-12 text-primary" />
                        </div>
                        <h4 className="text-xl font-black text-gray-900 mb-2">Immediate Registration</h4>
                        <p className="text-muted-foreground font-medium mb-8">Click below to bypass scheduling for urgent cases.</p>
                        <Button className="bg-primary text-white font-black h-14 px-10 rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 w-full animate-bounce">
                            New Emergency Entry
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
