"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"
import type { Patient } from "@/types"
import { useAuth } from "@/contexts/auth-context"
import { AddPatientDialog } from "@/components/patients/add-patient-dialog"
import { EditPatientDialog } from "@/components/patients/edit-patient-dialog"

export default function ReceptionistPatientsPage() {
    const { user } = useAuth()
    const [patients, setPatients] = useState<Patient[]>([])
    const [search, setSearch] = useState("")
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
    const handleAddPatient = (newPatient: any) => {
        setPatients(prev => [newPatient, ...prev])
        setIsAddOpen(false)
    }

    const handleEditPatient = (updated: any) => {
        setPatients(prev => prev.map((p) => p.id === updated.id ? updated : p))
        setIsEditOpen(false)
        setSelectedPatient(null)
    }

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await fetch('/api/patients')
                if (response.ok) {
                    const data = await response.json()
                    setPatients(data)
                }
            } catch (error) {
                console.error("Error fetching patients:", error)
            }
        }
        fetchPatients()
    }, [])

    const filtered = patients.filter(p => {
        const fullName = p.firstName && p.lastName ? `${p.firstName} ${p.lastName}` : (p as any).name || ""
        const searchLower = search.toLowerCase()
        return (
            fullName.toLowerCase().includes(searchLower) ||
            (p.id?.toLowerCase() || "").includes(searchLower) ||
            (p.phone && p.phone.includes(search))
        )
    })

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-xl border border-red-50">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900">Patient Directory</h1>
                    <p className="text-lg font-medium text-muted-foreground mt-2">
                        Comprehensive management of all registered hospital patients.
                    </p>
                </div>
                <Button
                    onClick={() => setIsAddOpen(true)}
                    className="bg-red-600 text-white hover:bg-red-700 font-black h-14 px-8 rounded-2xl shadow-xl shadow-red-200 transition-all hover:scale-105 active:scale-95 group"
                >
                    <Icons.userPlus className="mr-3 h-5 w-5 transition-transform group-hover:scale-125" />
                    Register New Patient
                </Button>
            </div>

            <Card className="border-none shadow-2xl overflow-hidden bg-white/50 backdrop-blur-xl ring-2 ring-red-50">
                <CardHeader className="bg-red-600 p-8 border-b border-red-700">
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                        <div className="relative w-full md:max-w-md group">
                            <Icons.search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-300 group-focus-within:text-white transition-colors" />
                            <Input
                                placeholder="Search by name, ID, or phone..."
                                className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-red-200 focus:ring-white/30 focus:border-white/40 rounded-xl font-bold"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" className="h-14 px-6 bg-white/10 text-white border-white/20 hover:bg-white hover:text-red-600 font-bold rounded-xl transition-all">
                                <Icons.filter className="mr-2 h-4 w-4" /> Filter
                            </Button>
                            <Button variant="outline" className="h-14 px-6 bg-white/10 text-white border-white/20 hover:bg-white hover:text-red-600 font-bold rounded-xl transition-all">
                                <Icons.download className="mr-2 h-4 w-4" /> Export
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-red-900/40 border-b border-red-50 bg-red-50/30">
                                    <th className="py-5 px-8">Patient ID</th>
                                    <th className="py-5 px-4">FullName</th>
                                    <th className="py-5 px-4">Contact Info</th>
                                    <th className="py-5 px-4">Gender</th>
                                    <th className="py-5 px-4">Status</th>
                                    <th className="py-5 px-8 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-red-50">
                                {filtered.map((p, i) => (
                                    <tr key={i} className="group hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer">
                                        <td className="py-6 px-8">
                                            <span className="text-sm font-black tracking-tighter group-hover:text-white">{p.id}</span>
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-red-100 group-hover:bg-white/20 flex items-center justify-center text-red-600 group-hover:text-white font-black transition-colors">
                                                    {(p.firstName?.charAt(0) || (p as any).name?.charAt(0) || "?")}
                                                    {(p.lastName?.charAt(0) || (p as any).name?.split(" ")[1]?.charAt(0) || "")}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black transition-colors">
                                                        {p.firstName && p.lastName ? `${p.firstName} ${p.lastName}` : (p as any).name}
                                                    </div>
                                                    <div className="text-[10px] font-bold text-red-600/60 group-hover:text-red-100 uppercase tracking-widest mt-0.5">Born: {p.dateOfBirth}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="text-sm font-bold opacity-80 group-hover:opacity-100">{p.phone}</div>
                                            <div className="text-[10px] font-bold opacity-60 group-hover:opacity-80">{p.email}</div>
                                        </td>
                                        <td className="py-6 px-4">
                                            <Badge variant="outline" className="text-[10px] font-black uppercase tracking-tighter border-red-100 group-hover:border-white group-hover:text-white group-hover:bg-white/10">{p.gender}</Badge>
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className={cn("h-2 w-2 rounded-full", p.status === 'active' ? 'bg-green-500' : 'bg-gray-400')} />
                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{p.status}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-10 w-10 p-0 rounded-xl bg-red-50 text-red-600 transition-all shadow-sm group-hover:bg-white group-hover:text-red-600"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setSelectedPatient(p)
                                                        setIsEditOpen(true)
                                                    }}
                                                >
                                                    <Icons.edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-10 w-10 p-0 rounded-xl bg-red-50 text-red-600 group-hover:bg-white group-hover:text-red-600 transition-all shadow-sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        // Future: Open context menu or more actions
                                                    }}
                                                >
                                                    <Icons.moreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filtered.length === 0 && (
                        <div className="p-20 text-center">
                            <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Icons.search className="h-10 w-10 text-red-200" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">No Patients Found</h3>
                            <p className="text-muted-foreground mt-2 font-medium">Try adjusting your search criteria or register a new patient.</p>
                            <Button className="mt-8 bg-red-600 text-white hover:bg-red-700 font-black h-12 px-8 rounded-xl shadow-xl shadow-red-100">Clear Search</Button>
                        </div>
                    )}
                    <div className="p-6 bg-red-50/30 border-t border-red-50 flex items-center justify-between">
                        <p className="text-xs font-black text-red-900/40 uppercase tracking-widest">Showing {filtered.length} of {patients.length} total patients</p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled className="h-10 px-4 rounded-xl font-bold uppercase tracking-tighter text-[10px]">Previous</Button>
                            <Button variant="outline" size="sm" disabled className="h-10 px-4 rounded-xl font-bold uppercase tracking-tighter text-[10px]">Next</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <AddPatientDialog
                open={isAddOpen}
                onOpenChange={setIsAddOpen}
                onPatientAdded={handleAddPatient}
                userId={user?.id}
            />

            {selectedPatient && (
                <EditPatientDialog
                    patient={selectedPatient}
                    open={isEditOpen}
                    onOpenChange={setIsEditOpen}
                    onPatientUpdated={handleEditPatient}
                />
            )}
        </div>
    )
}
