"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { NewClaimDialog } from "@/components/insurance/new-claim-dialog"
import { format } from "date-fns"

export default function ReceptionistInsurancePage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [claims, setClaims] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchClaims = async () => {
        try {
            const res = await fetch('/api/insurance')
            if (res.ok) {
                const data = await res.json()
                setClaims(data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchClaims()
    }, [])

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-xl border border-red-50">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900">Insurance Management</h1>
                    <p className="text-lg font-medium text-muted-foreground mt-2">
                        Verify <span className="text-red-600 font-bold">coverage, claims</span>, and carrier partnerships.
                    </p>
                </div>
                <Button
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-red-600 text-white hover:bg-red-700 font-black h-14 px-8 rounded-2xl shadow-xl shadow-red-200 transition-all hover:scale-105 active:scale-95 group"
                >
                    <Icons.plus className="mr-3 h-5 w-5 transition-transform group-hover:rotate-90" />
                    New Insurance Claim
                </Button>
            </div>

            <Card className="border-none shadow-2xl overflow-hidden bg-white">
                <CardHeader className="bg-red-600 p-8 border-b border-red-700">
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                        <div className="relative w-full md:max-w-md group">
                            <Icons.search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-300 group-focus-within:text-white transition-colors" />
                            <Input
                                placeholder="Search by Policy Number or Patient ID..."
                                className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-red-200 focus:ring-white/30 focus:border-white/40 rounded-xl font-bold"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-red-900/40 border-b border-red-50 bg-red-50/30">
                                    <th className="py-5 px-8">Provider</th>
                                    <th className="py-5 px-4">Policy #</th>
                                    <th className="py-5 px-4">Patient</th>
                                    <th className="py-5 px-4">Created At</th>
                                    <th className="py-5 px-4">Status</th>
                                    <th className="py-5 px-8 text-right">Verification</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-red-50">
                                {loading ? (
                                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Loading claims...</td></tr>
                                ) : claims.length === 0 ? (
                                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No insurance claims found.</td></tr>
                                ) : (
                                    claims.map((item, i) => (
                                        <tr key={i} className="group hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer">
                                            <td className="py-6 px-8 font-black">{item.provider}</td>
                                            <td className="py-6 px-4 text-sm font-bold opacity-80">{item.policy_number}</td>
                                            <td className="py-6 px-4 font-black">{item.patient_name || item.patient_id}</td>
                                            <td className="py-6 px-4 text-sm font-bold opacity-80">
                                                {item.created_at ? format(new Date(item.created_at), 'MMM dd, yyyy') : '-'}
                                            </td>
                                            <td className="py-6 px-4">
                                                <Badge className={cn(
                                                    "font-black tracking-tighter uppercase text-[10px]",
                                                    item.status === 'Approved' ? 'bg-green-500 hover:bg-green-600' :
                                                        item.status === 'Pending' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-600'
                                                )}>
                                                    {item.status}
                                                </Badge>
                                            </td>
                                            <td className="py-6 px-8 text-right">
                                                <Button variant="ghost" size="sm" className="font-black text-red-600 group-hover:text-white hover:bg-white/20">Check Status</Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <NewClaimDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSuccess={fetchClaims}
            />
        </div>
    )
}
