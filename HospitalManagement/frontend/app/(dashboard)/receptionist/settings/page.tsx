"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function ReceptionistSettingsPage() {
    return (
        <div className="space-y-8 max-w-[1000px] mx-auto pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-xl border border-red-50">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 border-l-8 border-red-600 pl-4">Settings</h1>
                    <p className="text-lg font-medium text-muted-foreground mt-2">
                        Manage your <span className="text-red-600 font-bold">profile and preferences</span>.
                    </p>
                </div>
            </div>

            <div className="grid gap-8">
                <Card className="border-none shadow-2xl overflow-hidden bg-white">
                    <CardHeader className="bg-red-50 p-6 border-b border-red-100">
                        <CardTitle className="text-xl font-black uppercase tracking-widest text-red-900">Notifications</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">

                        <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-red-50 transition-colors">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-black uppercase tracking-widest">Internal Messages</Label>
                                <p className="text-xs text-muted-foreground font-medium">Sound alert for incoming staff messages.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-red-50 transition-colors">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-black uppercase tracking-widest">Schedule Changes</Label>
                                <p className="text-xs text-muted-foreground font-medium">Email summary of daily appointment adjustments.</p>
                            </div>
                            <Switch />
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}
