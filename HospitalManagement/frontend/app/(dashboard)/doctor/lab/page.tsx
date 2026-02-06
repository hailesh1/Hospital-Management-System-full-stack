"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PrescriptionsTable } from "@/components/lab/prescriptions-table"
import { LabTestsTable } from "@/components/lab/lab-tests-table"
import { AddPrescriptionDialog } from "@/components/lab/add-prescription-dialog"
import { OrderLabTestDialog } from "@/components/lab/order-lab-test-dialog"
import { Button } from "@/components/ui/button"
import { Plus, Pill, FlaskConical } from "lucide-react"

export default function DoctorLabPrescriptionsPage() {
    const [prescriptions, setPrescriptions] = useState([])
    const [labTests, setLabTests] = useState([])
    const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false)
    const [isLabOpen, setIsLabOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        setLoading(true)
        try {
            const [pRes, lRes] = await Promise.all([
                fetch('/api/prescriptions'),
                fetch('/api/lab-tests')
            ])
            if (pRes.ok) setPrescriptions(await pRes.json())
            if (lRes.ok) setLabTests(await lRes.json())
        } catch (error) {
            console.error("Failed to fetch lab/prescriptions:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Lab & Prescriptions</h1>
                    <p className="text-muted-foreground">Manage patient medications and laboratory orders.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setIsPrescriptionOpen(true)} variant="outline">
                        <Pill className="mr-2 h-4 w-4" />
                        New Prescription
                    </Button>
                    <Button onClick={() => setIsLabOpen(true)}>
                        <FlaskConical className="mr-2 h-4 w-4" />
                        Order Lab Test
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="prescriptions" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                    <TabsTrigger value="lab-tests">Lab Tests</TabsTrigger>
                </TabsList>
                <TabsContent value="prescriptions">
                    <PrescriptionsTable prescriptions={prescriptions} onUpdate={fetchData} />
                </TabsContent>
                <TabsContent value="lab-tests">
                    <LabTestsTable tests={labTests} onUpdate={fetchData} />
                </TabsContent>
            </Tabs>

            <AddPrescriptionDialog
                open={isPrescriptionOpen}
                onOpenChange={setIsPrescriptionOpen}
                onAdd={async (data) => {
                    try {
                        const res = await fetch('/api/prescriptions', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data),
                        })
                        if (res.ok) {
                            await fetchData()
                            setIsPrescriptionOpen(false)
                        } else {
                            const err = await res.json()
                            alert(`Error: ${err.details || err.error}`)
                        }
                    } catch (error) {
                        console.error("Failed to add prescription:", error)
                    }
                }}
            />

            <OrderLabTestDialog
                open={isLabOpen}
                onOpenChange={setIsLabOpen}
                onAdd={async (data) => {
                    try {
                        const res = await fetch('/api/lab-tests', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data),
                        })
                        if (res.ok) {
                            await fetchData()
                            setIsLabOpen(false)
                        } else {
                            const err = await res.json()
                            alert(`Error: ${err.details || err.error}`)
                        }
                    } catch (error) {
                        console.error("Failed to order lab test:", error)
                    }
                }}
            />
        </div>
    )
}
