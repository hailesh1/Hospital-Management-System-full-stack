"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Mail, Phone, MapPin, Lock, ShieldCheck, Save, X } from "lucide-react"

export default function PatientProfilePage() {
    const [isEditing, setIsEditing] = useState(false)

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900">My Profile</h1>
                    <p className="text-lg font-medium text-muted-foreground mt-1">
                        Securely manage your personal information and account settings.
                    </p>
                </div>
                <div className="flex gap-3">
                    {isEditing ? (
                        <>
                            <Button variant="outline" className="font-bold h-11 px-6 border-2 hover:bg-gray-50" onClick={() => setIsEditing(false)}>
                                <X className="mr-2 h-5 w-5" /> Cancel
                            </Button>
                            <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-11 px-6 shadow-lg shadow-primary/20" onClick={() => setIsEditing(false)}>
                                <Save className="mr-2 h-5 w-5" /> Save Changes
                            </Button>
                        </>
                    ) : (
                        <Button className="bg-primary hover:bg-primary/90 text-white font-black h-11 px-8 shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95" onClick={() => setIsEditing(true)}>
                            Manage Profile
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left Column: Avatar & Basic Info */}
                <div className="lg:col-span-1 space-y-8">
                    <Card className="border-none shadow-2xl overflow-hidden bg-white group">
                        <div className="h-32 bg-gradient-to-br from-primary to-primary-foreground/20" />
                        <CardContent className="relative pt-0 text-center pb-8">
                            <div className="relative -mt-16 mb-6 inline-block">
                                <Avatar className="h-32 w-32 border-8 border-white shadow-2xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                                    <AvatarFallback className="bg-primary text-white text-4xl font-black">DA</AvatarFallback>
                                </Avatar>
                                <div className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg border border-primary/10">
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Dawit Alemu</h2>
                            <p className="text-primary font-bold uppercase tracking-widest text-sm mt-1">Verified Patient</p>
                            <div className="mt-6 pt-6 border-t border-primary/5 flex justify-center gap-6">
                                <div className="text-center">
                                    <p className="text-2xl font-black text-gray-900">O+</p>
                                    <p className="text-[10px] uppercase font-black text-primary/60 mt-1">Blood Type</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-black text-gray-900">182</p>
                                    <p className="text-[10px] uppercase font-black text-primary/60 mt-1">Height (cm)</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-black text-gray-900">75</p>
                                    <p className="text-[10px] uppercase font-black text-primary/60 mt-1">Weight (kg)</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl bg-primary text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 -m-4 w-24 h-24 bg-primary/20 rounded-full blur-3xl opacity-50" />
                        <CardContent className="p-6 relative z-10">
                            <h3 className="font-black uppercase tracking-widest mb-4">Patient Identity</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-primary-foreground/60 text-xs font-bold uppercase">Patient ID Number</p>
                                    <p className="text-2xl font-black tracking-tighter">#P-1002-8821</p>
                                </div>
                                <div>
                                    <p className="text-primary-foreground/60 text-xs font-bold uppercase">Member Since</p>
                                    <p className="text-lg font-bold">October 2023</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right/Main Column: Form Details */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-2xl ring-2 ring-primary/5 overflow-hidden">
                        <CardHeader className="bg-primary/5 border-b border-primary/10 px-8 py-6">
                            <CardTitle className="text-xl font-black text-primary uppercase tracking-widest flex items-center">
                                <User className="mr-3 h-6 w-6" /> Personal Information
                            </CardTitle>
                            <CardDescription className="text-primary/60 font-medium">Update your basic contact info and address.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid gap-8 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase text-primary/40 ml-1">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-5 w-5 text-primary" />
                                        <Input disabled={!isEditing} defaultValue="Dawit Alemu" className="pl-10 h-12 font-bold border-primary/10 focus:border-primary focus:ring-primary" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase text-primary/40 ml-1">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-primary" />
                                        <Input disabled={!isEditing} type="email" defaultValue="dawit.alemu@hospital.com" className="pl-10 h-12 font-bold border-primary/10 focus:border-primary focus:ring-primary" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase text-primary/40 ml-1">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-5 w-5 text-primary" />
                                        <Input disabled={!isEditing} defaultValue="0911223344" className="pl-10 h-12 font-bold border-primary/10 focus:border-primary focus:ring-primary" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase text-primary/40 ml-1">Address</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-primary" />
                                        <Input disabled={!isEditing} defaultValue="Addis Ababa, Bole Subcity" className="pl-10 h-12 font-bold border-primary/10 focus:border-primary focus:ring-primary" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>


                </div>
            </div>
        </div>
    )
}
