"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Activity, Thermometer, Heart, Wind, Weight, Ruler, Clock, Loader2, Save } from "lucide-react"
import { toast } from "sonner"

interface VitalSignsCardProps {
    patientId: string
    appointmentId?: string
    lastVitals?: any
    onRecord?: () => void
}

export function VitalSignsCard({ patientId, appointmentId, lastVitals, onRecord }: VitalSignsCardProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        weight: lastVitals?.weight || "",
        height: lastVitals?.height || "",
        bloodPressure: lastVitals?.bloodPressure || "",
        temperature: lastVitals?.temperature || "",
        pulse: lastVitals?.pulse || "",
        respiratoryRate: lastVitals?.respiratoryRate || "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await fetch('/api/vital-signs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId,
                    appointmentId: appointmentId || null,
                    ...formData,
                    weight: formData.weight ? parseFloat(formData.weight as string) : null,
                    height: formData.height ? parseFloat(formData.height as string) : null,
                    temperature: formData.temperature ? parseFloat(formData.temperature as string) : null,
                    pulse: formData.pulse ? parseInt(formData.pulse as string) : null,
                    respiratoryRate: formData.respiratoryRate ? parseInt(formData.respiratoryRate as string) : null,
                }),
            })

            if (!response.ok) throw new Error('Failed to record vital signs')

            toast.success("Vital signs recorded")
            if (onRecord) onRecord()
        } catch (error) {
            console.error(error)
            toast.error("Failed to record vital signs")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="overflow-hidden border-t-4 border-t-red-500">
            <CardHeader className="bg-muted/50">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Activity className="h-5 w-5 text-red-500" />
                        Vital Signs
                    </CardTitle>
                    {lastVitals?.recorded_at && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Last: {new Date(lastVitals.recorded_at).toLocaleString()}
                        </span>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Heart className="h-3 w-3 text-red-500" />
                                BP (mmHg)
                            </Label>
                            <Input
                                placeholder="120/80"
                                value={formData.bloodPressure}
                                onChange={e => setFormData({ ...formData, bloodPressure: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Thermometer className="h-3 w-3 text-orange-500" />
                                Temp (°C)
                            </Label>
                            <Input
                                type="number"
                                step="0.1"
                                placeholder="36.5"
                                value={formData.temperature}
                                onChange={e => setFormData({ ...formData, temperature: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Activity className="h-3 w-3 text-blue-500" />
                                Pulse (bpm)
                            </Label>
                            <Input
                                type="number"
                                placeholder="72"
                                value={formData.pulse}
                                onChange={e => setFormData({ ...formData, pulse: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Wind className="h-3 w-3 text-teal-500" />
                                Resp (bpm)
                            </Label>
                            <Input
                                type="number"
                                placeholder="16"
                                value={formData.respiratoryRate}
                                onChange={e => setFormData({ ...formData, respiratoryRate: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Weight className="h-3 w-3 text-purple-500" />
                                Weight (kg)
                            </Label>
                            <Input
                                type="number"
                                step="0.1"
                                placeholder="70"
                                value={formData.weight}
                                onChange={e => setFormData({ ...formData, weight: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Ruler className="h-3 w-3 text-emerald-500" />
                                Height (cm)
                            </Label>
                            <Input
                                type="number"
                                placeholder="175"
                                value={formData.height}
                                onChange={e => setFormData({ ...formData, height: e.target.value })}
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Record Vital Signs
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
