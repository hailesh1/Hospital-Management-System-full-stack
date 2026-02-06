"use client"

import { useState, useEffect } from "react"
import { InvoicesTable } from "@/components/billing/invoices-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Wallet, Receipt } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function PatientBillingPage() {
    const { user } = useAuth()
    const [invoices, setInvoices] = useState<any[]>([])

    useEffect(() => {
        const fetchInvoices = async () => {
            if (!user?.id) return

            try {
                // Fetch invoices for the logged-in patient
                const res = await fetch(`/api/invoices?patient_id=${user.id}`)
                if (res.ok) {
                    const data = await res.json()
                    setInvoices(data)
                }
            } catch (error) {
                console.error("Failed to fetch invoices", error)
            }
        }
        fetchInvoices()
    }, [user])

    const lastPaidInvoice = invoices
        .filter(i => i.status?.toLowerCase() === 'paid')
        .sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime())[0];

    const handleUpdateInvoice = async (updatedInvoice: any) => {
        setInvoices(prev => prev.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv));
    }


    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Billing & Payments</h1>
                <p className="text-muted-foreground">
                    View your invoices, download receipts, and manage your payments securely.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] cursor-pointer hover:border-emerald-500 hover:shadow-emerald-500/20 group relative overflow-hidden border-l-8 border-l-primary bg-gradient-to-br from-white to-primary/5 shadow-lg">
                    <div className="absolute top-0 right-0 -m-2 w-12 h-12 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all duration-500" />
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity" />
                    <CardHeader className="pb-2 relative z-10">
                        <CardTitle className="text-sm font-black flex items-center text-primary/80 group-hover:text-emerald-700 transition-colors uppercase tracking-tighter">
                            <Wallet className="mr-2 h-5 w-5 text-primary shadow-md" />
                            Total Outstanding
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-primary drop-shadow-sm">
                            ETB {invoices.filter(i => i.status?.toLowerCase() === 'pending').reduce((sum, i) => sum + (Number(i.total) || 0), 0).toLocaleString()}
                        </div>
                        <p className="text-xs font-bold text-primary/70 mt-2">Due within current billing cycle</p>
                    </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] cursor-pointer hover:border-emerald-500 hover:shadow-emerald-500/20 group relative overflow-hidden border-l-8 border-l-primary/80 bg-gradient-to-br from-white to-primary/5 shadow-lg">
                    <div className="absolute top-0 right-0 -m-2 w-12 h-12 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all duration-500" />
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity" />
                    <CardHeader className="pb-2 relative z-10">
                        <CardTitle className="text-sm font-black flex items-center text-primary/80 group-hover:text-emerald-700 transition-colors uppercase tracking-tighter">
                            <Receipt className="mr-2 h-5 w-5 text-primary/80 shadow-md" />
                            Last Payment
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-primary/80 drop-shadow-sm">
                            {lastPaidInvoice ? `ETB ${Number(lastPaidInvoice.total).toLocaleString()}` : 'No payments'}
                        </div>
                        <p className="text-xs font-bold text-primary/70 mt-2">
                            {lastPaidInvoice
                                ? `Processed on ${new Date(lastPaidInvoice.updated_at || lastPaidInvoice.created_at).toLocaleDateString()}`
                                : 'Check back after your first payment'}
                        </p>
                    </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] cursor-pointer hover:border-emerald-500 hover:shadow-emerald-500/20 group relative overflow-hidden border-l-8 border-l-primary/60 bg-gradient-to-br from-white to-primary/5 shadow-lg">
                    <div className="absolute top-0 right-0 -m-2 w-12 h-12 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all duration-500" />
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity" />
                    <CardHeader className="pb-2 relative z-10">
                        <CardTitle className="text-sm font-black flex items-center text-primary/80 group-hover:text-emerald-700 transition-colors uppercase tracking-tighter">
                            <CreditCard className="mr-2 h-5 w-5 text-primary/60 shadow-md" />
                            Payment Methods
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-primary/60 drop-shadow-sm">2 Active</div>
                        <p className="text-xs font-bold text-primary/70 mt-2">Bank links and Cards</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-2xl overflow-hidden bg-white/90 backdrop-blur-xl ring-2 ring-primary/5">
                <CardHeader className="border-b border-primary/10 bg-primary px-6 py-4">
                    <CardTitle className="text-lg font-black text-white uppercase tracking-widest">Invoice History</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <InvoicesTable invoices={invoices} onUpdateInvoice={handleUpdateInvoice} />
                </CardContent>
            </Card>
        </div>
    )
}
