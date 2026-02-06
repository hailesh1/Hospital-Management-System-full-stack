"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Icons } from "@/components/ui/icons"

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(false)
    const [hospitalInfo, setHospitalInfo] = useState({
        name: "Holy Savior Hospital",
        address: "Addis Ababa, Ethiopia",
        phone: "+251 116 123 456",
        email: "info@holysavior.com"
    })

    const handleSaveInfo = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // Simulate API call
        setTimeout(() => {
            setLoading(false)
            toast.success("Hospital information updated successfully")
        }, 1000)
    }

    return (
        <div className="space-y-8 max-w-[1200px] mx-auto pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl border border-emerald-50">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white flex items-center">
                        System Settings <span className="ml-3 px-3 py-1 bg-emerald-500 text-white text-xs rounded-full uppercase tracking-tighter">Configuration</span>
                    </h1>
                    <p className="text-lg font-medium text-muted-foreground mt-2">
                        Configure <span className="text-emerald-600 font-bold">core system parameters</span> and hospital metadata.
                    </p>
                </div>
            </div>

            <Tabs defaultValue="hospital" className="space-y-6">
                <TabsList className="bg-white p-1 rounded-xl border border-emerald-50 shadow-sm">
                    <TabsTrigger value="hospital" className="rounded-lg px-6 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">Hospital Info</TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-lg px-6 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">Notifications</TabsTrigger>
                    <TabsTrigger value="security" className="rounded-lg px-6 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">Security & Backup</TabsTrigger>
                </TabsList>

                <TabsContent value="hospital">
                    <Card className="border-none shadow-xl">
                        <CardHeader>
                            <CardTitle>Hospital Profile</CardTitle>
                            <CardDescription>Update your hospital's public information and contact details.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSaveInfo} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="h-name">Hospital Name</Label>
                                        <Input id="h-name" value={hospitalInfo.name} onChange={e => setHospitalInfo({ ...hospitalInfo, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="h-email">System Email</Label>
                                        <Input id="h-email" type="email" value={hospitalInfo.email} onChange={e => setHospitalInfo({ ...hospitalInfo, email: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="h-phone">Contact Number</Label>
                                        <Input id="h-phone" value={hospitalInfo.phone} onChange={e => setHospitalInfo({ ...hospitalInfo, phone: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="h-address">Address</Label>
                                        <Input id="h-address" value={hospitalInfo.address} onChange={e => setHospitalInfo({ ...hospitalInfo, address: e.target.value })} />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button type="submit" className="bg-emerald-600 text-white font-black px-10 h-12 rounded-xl" disabled={loading}>
                                        {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card className="border-none shadow-xl">
                        <CardHeader>
                            <CardTitle>System Notifications</CardTitle>
                            <CardDescription>Configure how the system communicates with patients and staff.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {[
                                { title: "SMS Alerts", desc: "Send appointment reminders via SMS to patients." },
                                { title: "Email Notifications", desc: "Send medical records and invoice copies via email." },
                                { title: "Staff Push Notifications", desc: "Alert staff of new appointments and system updates." },
                                { title: "Critical Alerts", desc: "Interrupt active sessions for emergency system-wide announcements." }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50/30 border border-emerald-50">
                                    <div>
                                        <p className="font-bold text-emerald-900">{item.title}</p>
                                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-none shadow-xl">
                            <CardHeader>
                                <CardTitle>Data Backup</CardTitle>
                                <CardDescription>Manage automated database backups.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 rounded-xl border border-blue-50 bg-blue-50/30">
                                    <p className="text-sm font-bold text-blue-900">Last successful backup: Today at 03:00 AM</p>
                                </div>
                                <Button className="w-full bg-blue-600 text-white font-black py-6 rounded-xl">
                                    <Icons.download className="mr-2 h-5 w-5" /> Trigger Manual Backup
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-xl">
                            <CardHeader>
                                <CardTitle>Two-Factor Authentication</CardTitle>
                                <CardDescription>Enhance account security for all staff members.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-red-50/30 border border-red-50">
                                    <div>
                                        <p className="font-bold text-red-900">Enforce 2FA for Admins</p>
                                        <p className="text-sm text-muted-foreground">Require OTP for all administrative logins.</p>
                                    </div>
                                    <Switch />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
