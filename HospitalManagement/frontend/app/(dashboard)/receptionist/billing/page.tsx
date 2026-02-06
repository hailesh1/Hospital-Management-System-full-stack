"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateInvoiceDialog } from "@/components/billing/create-invoice-dialog"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"

export default function ReceptionistBillingPage() {
    const { user } = useAuth()
    const [invoices, setInvoices] = useState<any[]>([])
    const [search, setSearch] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    const fetchInvoices = async () => {
        try {
            const res = await fetch('/api/billing')
            if (res.ok) {
                const data = await res.json()
                // Map API data to component state structure
                const mapped = data.map((inv: any) => ({
                    id: inv.id,
                    patientName: inv.patient_name,
                    amount: inv.total,
                    status: inv.status,
                    date: inv.date ? new Date(inv.date).toISOString().split('T')[0] : '',
                    type: inv.type || "General Service"
                }))
                setInvoices(mapped)
            }
        } catch (error) {
            console.error("Failed to fetch invoices:", error)
            toast.error("Failed to load invoices")
        }
    }

    useEffect(() => {
        fetchInvoices()
    }, [])

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/billing/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })

            if (res.ok) {
                toast.success(`Invoice status updated to ${newStatus}`)
                fetchInvoices()
            } else {
                throw new Error("Failed to update status")
            }
        } catch (error) {
            toast.error("Failed to update status")
        }
    }

    const handlePayNow = (id: string) => {
        handleStatusChange(id, 'paid')
    }

    const handleAddInvoice = (newInvoice: any) => {
        setIsCreateOpen(false)
        fetchInvoices()
        toast.success("Invoice created successfully")
    }

    const filtered = invoices.filter(i => {
        const pName = i.patientName || ""
        const invId = i.id || ""
        const sLower = search.toLowerCase()
        return pName.toLowerCase().includes(sLower) || invId.toLowerCase().includes(sLower)
    })

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-xl border border-red-50">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900">Billing Center</h1>
                    <p className="text-lg font-medium text-muted-foreground mt-2">
                        Manage payments, generate invoices, and track hospital revenue.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="bg-red-600 text-white hover:bg-red-700 font-black h-14 px-8 rounded-2xl shadow-xl shadow-red-200 transition-all hover:scale-105 active:scale-95 group"
                    >
                        <Icons.plus className="mr-3 h-5 w-5 transition-transform group-hover:scale-125" />
                        Quick Invoice
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Today's Collection", val: `ETB ${invoices.filter(i => i.status === 'paid' && i.date === new Date().toISOString().split('T')[0]).reduce((acc, i) => acc + i.amount, 0).toLocaleString()}`, trend: "+12%", color: "red-600" },
                    { label: "Pending Payments", val: invoices.filter(i => i.status === 'pending').length.toString(), trend: "Needs Attention", color: "red-500" },
                    { label: "Insurance Claims", val: "28", trend: "Processing", color: "red-400" },
                ].map((stat, idx) => (
                    <Card key={idx} className={cn("border-none shadow-xl border-l-4 bg-white", "border-l-red-600")}>
                        <CardContent className="p-6">
                            <p className="text-[10px] font-black uppercase tracking-widest text-red-900/40 mb-2">{stat.label}</p>
                            <div className="text-2xl font-black text-gray-900">{stat.val}</div>
                            <p className={cn("text-[10px] font-bold mt-1 uppercase", "text-red-600")}>{stat.trend}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-none shadow-2xl overflow-hidden bg-white/50 backdrop-blur-xl ring-2 ring-red-50">
                <CardHeader className="bg-red-600 p-8 border-b border-red-700">
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                        <div className="relative w-full md:max-w-md group">
                            <Icons.search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-300 group-focus-within:text-white transition-colors" />
                            <Input
                                placeholder="Search by patient or invoice ID..."
                                className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-red-200 focus:ring-white/30 focus:border-white/40 rounded-xl font-bold"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" className="h-14 px-6 bg-white/10 text-white border-white/20 hover:bg-white hover:text-red-600 font-bold rounded-xl transition-all">
                                Filter Status
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-red-900/40 border-b border-red-50 bg-red-50/30">
                                    <th className="py-5 px-8">Invoice ID</th>
                                    <th className="py-5 px-4">Patient Name</th>
                                    <th className="py-5 px-4">Service Type</th>
                                    <th className="py-5 px-4">Total Amount</th>
                                    <th className="py-5 px-4">Status</th>
                                    <th className="py-5 px-8 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-red-50">
                                {filtered.map((inv, i) => (
                                    <tr key={i} className="group hover:bg-red-50 transition-all duration-300">
                                        <td className="py-6 px-8">
                                            <span className="text-sm font-black tracking-tighter text-gray-900">{inv.id}</span>
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="text-sm font-black text-gray-900">{inv.patientName}</div>
                                            <div className="text-[10px] font-bold text-red-600/60 uppercase tracking-widest mt-0.5">Date: {inv.date}</div>
                                        </td>
                                        <td className="py-6 px-4">
                                            <Badge variant="outline" className="text-[10px] font-black uppercase tracking-tighter border-red-100 text-red-600 transition-all">{inv.type}</Badge>
                                        </td>
                                        <td className="py-6 px-4">
                                            <span className="text-lg font-black tracking-tighter text-gray-900">
                                                ETB {inv.amount !== undefined && inv.amount !== null ? inv.amount.toLocaleString() : "0.00"}
                                            </span>
                                        </td>
                                        <td className="py-6 px-4">
                                            <Select
                                                value={inv.status}
                                                onValueChange={(val) => handleStatusChange(inv.id, val)}
                                            >
                                                <SelectTrigger className={cn("h-10 w-40 font-black text-[10px] uppercase tracking-widest border-none bg-transparent focus:ring-0",
                                                    inv.status === 'paid' ? 'text-green-600' :
                                                        inv.status === 'pending' ? 'text-yellow-600' :
                                                            inv.status === 'cancelled' ? 'text-gray-500' : 'text-red-600'
                                                )}>
                                                    <div className="flex items-center gap-2">
                                                        <div className={cn("h-2.5 w-2.5 rounded-full ring-2 ring-white shadow-sm",
                                                            inv.status === 'paid' ? 'bg-green-500' :
                                                                inv.status === 'pending' ? 'bg-yellow-500' :
                                                                    inv.status === 'cancelled' ? 'bg-gray-400' : 'bg-red-500')}
                                                        />
                                                        <SelectValue />
                                                    </div>
                                                </SelectTrigger>
                                                <SelectContent className="z-[9999]">
                                                    <SelectItem value="pending" className="text-[10px] font-black uppercase tracking-widest text-yellow-600">Pending</SelectItem>
                                                    <SelectItem value="paid" className="text-[10px] font-black uppercase tracking-widest text-green-600">Paid</SelectItem>
                                                    <SelectItem value="overdue" className="text-[10px] font-black uppercase tracking-widest text-red-600">Overdue</SelectItem>
                                                    {user?.role === 'admin' && (
                                                        <SelectItem value="cancelled" className="text-[10px] font-black uppercase tracking-widest text-gray-500">Cancelled</SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        <td className="py-6 px-8 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {inv.status !== 'paid' && (
                                                    <Button
                                                        onClick={() => handlePayNow(inv.id)}
                                                        size="sm"
                                                        className="bg-red-600 text-white font-black h-10 rounded-xl hover:scale-105 shadow-md px-4"
                                                    >
                                                        Pay Now
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="sm" onClick={() => {
                                                    import('jspdf').then(({ jsPDF }) => {
                                                        const doc = new jsPDF()

                                                        // Header
                                                        doc.setFontSize(22)
                                                        doc.setTextColor(220, 38, 38)
                                                        doc.text("INVOICE", 105, 20, { align: "center" })

                                                        // Info
                                                        doc.setFontSize(10)
                                                        doc.setTextColor(0)
                                                        doc.text(`Invoice ID: ${inv.id}`, 20, 40)
                                                        doc.text(`Date: ${inv.date}`, 20, 45)
                                                        doc.text(`Patient: ${inv.patientName}`, 20, 55)
                                                        doc.text(`Type: ${inv.type}`, 20, 60)

                                                        doc.setFontSize(12)
                                                        doc.text(`Total Amount: ETB ${inv.amount?.toLocaleString()}`, 20, 80)
                                                        doc.text(`Status: ${inv.status.toUpperCase()}`, 20, 90)

                                                        doc.save(`Invoice-${inv.id}.pdf`)
                                                    })
                                                }} className="h-10 w-10 p-0 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm">
                                                    <Icons.download className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm">
                                                    <Icons.moreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <CreateInvoiceDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                onAdd={handleAddInvoice}
            />
        </div>
    )
}
