"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckInVisitorDialog } from "@/components/visitors/check-in-visitor-dialog"
import { toast } from "sonner"

export default function ReceptionistVisitorLogPage() {
    const [isCheckInOpen, setIsCheckInOpen] = useState(false)
    const [visitors, setVisitors] = useState([
        { name: "Samuel Abraham", purpose: "Visiting Patient", target: "John Smith (Room 102)", time: "10:15 AM", status: "In Facility" },
        { name: "Contractor (Elevator Fix)", purpose: "Maintenance", target: "Operations", time: "09:00 AM", status: "In Facility" },
        { name: "Fatima Ali", purpose: "Visiting Patient", target: "Emma Wilson (Room 201)", time: "08:30 AM", status: "Checked Out" },
    ])
    const [searchTerm, setSearchTerm] = useState("")

    const handleCheckIn = (newVisitor: any) => {
        setVisitors([newVisitor, ...visitors])
        toast.success(`${newVisitor.name} checked in successfully`)
    }

    const filteredVisitors = visitors.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.target.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-xl border border-red-50">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900">Visitor Management</h1>
                    <p className="text-lg font-medium text-muted-foreground mt-2">
                        Track <span className="text-red-600 font-bold">guests, contractors</span>, and family visits.
                    </p>
                </div>
                <Button
                    onClick={() => setIsCheckInOpen(true)}
                    className="bg-red-600 text-white hover:bg-red-700 font-black h-14 px-8 rounded-2xl shadow-xl shadow-red-200 transition-all hover:scale-105 active:scale-95 group"
                >
                    <Icons.plus className="mr-3 h-5 w-5 transition-transform group-hover:rotate-90" />
                    Check-in Visitor
                </Button>
            </div>

            <Card className="border-none shadow-2xl overflow-hidden bg-white">
                <CardHeader className="bg-red-600 p-8 border-b border-red-700">
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                        <div className="relative w-full md:max-w-md group">
                            <Icons.search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-300 group-focus-within:text-white transition-colors" />
                            <Input
                                placeholder="Search by name or ID..."
                                className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-red-200 focus:ring-white/30 focus:border-white/40 rounded-xl font-bold"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-red-900/40 border-b border-red-50 bg-red-50/30">
                                    <th className="py-5 px-8">Visitor Name</th>
                                    <th className="py-5 px-4">Purpose</th>
                                    <th className="py-5 px-4">Patient/Dept</th>
                                    <th className="py-5 px-4">Time In</th>
                                    <th className="py-5 px-8 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-red-50">
                                {filteredVisitors.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                                            No visitors found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredVisitors.map((item, i) => (
                                        <tr key={i} className="group hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer">
                                            <td className="py-6 px-8 font-black">{item.name}</td>
                                            <td className="py-6 px-4 text-sm font-bold opacity-80">{item.purpose}</td>
                                            <td className="py-6 px-4 font-black">{item.target}</td>
                                            <td className="py-6 px-4 text-sm font-bold opacity-80">{item.time}</td>
                                            <td className="py-6 px-8 text-right">
                                                <Badge className={item.status === 'In Facility' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400'}>
                                                    {item.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <CheckInVisitorDialog
                open={isCheckInOpen}
                onOpenChange={setIsCheckInOpen}
                onCheckIn={handleCheckIn}
            />
        </div>
    )
}
