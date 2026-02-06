"use client"

import { useEffect, useState } from "react"
import { InvoicesTable } from "@/components/billing/invoices-table"
import { CreateInvoiceDialog } from "@/components/billing/create-invoice-dialog"
import { DashboardCard } from "@/components/dashboard-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function AdminBillingPage() {
    const [invoices, setInvoices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isAddOpen, setIsAddOpen] = useState(false)

    const fetchInvoices = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/invoices')
            if (response.ok) {
                const data = await response.json()
                setInvoices(data)
            }
        } catch (error) {
            console.error("Failed to fetch invoices:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchInvoices()
    }, [])

    const handleAddInvoice = () => {
        fetchInvoices()
        setIsAddOpen(false)
    }

    const handleUpdateInvoice = async (updated: any) => {
        // Since we don't have a PUT endpoint yet, we just refresh for now
        // or we can implement the PUT endpoint if needed.
        fetchInvoices()
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl shadow-green-900/5 border border-green-50 dark:border-green-900/20">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white flex items-center">
                        Billing & Payments <span className="ml-3 px-3 py-1 bg-green-500 text-white text-xs rounded-full uppercase tracking-tighter animate-pulse">Live</span>
                    </h1>
                    <p className="text-lg font-medium text-muted-foreground mt-2">
                        Manage <span className="text-green-600 font-bold">invoices, claims</span>, and payment records.
                    </p>
                </div>
                <Button
                    onClick={() => setIsAddOpen(true)}
                    className="bg-green-600 text-white hover:bg-green-700 font-black h-14 px-8 rounded-2xl shadow-xl shadow-green-200 transition-all hover:scale-105 active:scale-95 group"
                >
                    <Plus className="mr-3 h-5 w-5 transition-transform group-hover:rotate-90" />
                    Create Invoice
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard
                    title="Total Revenue"
                    value={`ETB ${invoices.filter((i: any) => i.status === 'paid').reduce((sum: number, i: any) => sum + (i.total || 0), 0).toLocaleString()}`}
                    description="Successfully collected"
                    icon="dollarSign"
                />
                <DashboardCard
                    title="Pending Payments"
                    value={`ETB ${invoices.filter((i: any) => i.status === 'pending').reduce((sum: number, i: any) => sum + (i.total || 0), 0).toLocaleString()}`}
                    description="Awaiting settlement"
                    icon="creditCard"
                />
                <DashboardCard
                    title="Invoice Count"
                    value={invoices.length.toString()}
                    description="Total generated"
                    icon="billing"
                />
                <DashboardCard
                    title="Collection Rate"
                    value={invoices.length > 0 ? `${Math.round((invoices.filter((i: any) => i.status === 'paid').length / invoices.length) * 100)}%` : "0%"}
                    description="Efficiency"
                    icon="activity"
                />
            </div>

            <InvoicesTable invoices={invoices} onUpdateInvoice={handleUpdateInvoice} />

            <CreateInvoiceDialog
                open={isAddOpen}
                onOpenChange={setIsAddOpen}
                onAdd={handleAddInvoice}
            />
        </div>
    )
}
