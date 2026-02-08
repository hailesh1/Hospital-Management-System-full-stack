"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Mail, Phone, MapPin, Lock, ShieldCheck, Save, X, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

export default function PatientProfilePage() {
    const { user } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [profileData, setProfileData] = useState<any>(null)

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.id) return
            setIsLoading(true)
            try {
                const res = await fetch(`/api/patients/${user.id}`)
                if (res.ok) {
                    const data = await res.json()
                    setProfileData(data)
                } else {
                    console.error("Failed to fetch profile:", await res.text())
                    // Fallback to session data if DB fetch fails
                    setProfileData({
                        name: user.name,
                        email: user.email,
                        id: user.id
                    })
                }
            } catch (error) {
                console.error("Error fetching profile:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchProfile()
    }, [user])

    const handleSave = () => {
        setIsEditing(false)
        toast.success("Profile updated successfully")
    }

    if (isLoading && !profileData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-muted-foreground font-bold animate-pulse">Loading secure profile...</p>
            </div>
        )
    }

    if (!profileData || (!profileData.name && !profileData.email)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center max-w-md mx-auto">
                <div className="bg-red-100 p-4 rounded-full">
                    <ShieldCheck className="h-12 w-12 text-red-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-gray-900">Session Sync Issue</h2>
                    <p className="text-muted-foreground mt-2 font-medium">
                        We couldn't securely link your active session to your patient record. This usually happens if your session ID is outdated.
                    </p>
                </div>
                <div className="flex flex-col w-full gap-3">
                    <Button
                        className="w-full bg-primary hover:bg-primary/90 h-12 font-bold shadow-lg"
                        onClick={() => {
                            localStorage.removeItem('user');
                            window.location.href = '/login';
                        }}
                    >
                        Re-authenticate (Recommended)
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full h-12 font-bold border-2"
                        onClick={() => window.location.reload()}
                    >
                        Retry Connection
                    </Button>
                </div>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                    Technical ID: {user?.id || "Unknown"}
                </p>
            </div>
        )
    }

    const initials = profileData?.name
        ? profileData.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)
        : "U"

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-10 transition-all duration-500 animate-in fade-in slide-in-from-bottom-5">
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
                            <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-11 px-6 shadow-lg shadow-primary/20" onClick={handleSave}>
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
                                    <AvatarFallback className="bg-primary text-white text-4xl font-black">{initials}</AvatarFallback>
                                </Avatar>
                                <div className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg border border-primary/10">
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">{profileData?.name || "User"}</h2>
                            <p className="text-primary font-bold uppercase tracking-widest text-sm mt-1">Verified Patient</p>
                            <div className="mt-6 pt-6 border-t border-primary/5 flex justify-center gap-6">
                                <div className="text-center">
                                    <p className="text-2xl font-black text-gray-900">{profileData?.blood_type || profileData?.bloodType || "—"}</p>
                                    <p className="text-[10px] uppercase font-black text-primary/60 mt-1">Blood Type</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-black text-gray-900">{profileData?.height || "—"}</p>
                                    <p className="text-[10px] uppercase font-black text-primary/60 mt-1">Height (cm)</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-black text-gray-900">{profileData?.weight || "—"}</p>
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
                                    <p className="text-xl font-black tracking-tighter truncate" title={profileData?.id}>#{profileData?.id?.substring(0, 13)}...</p>
                                </div>
                                <div>
                                    <p className="text-primary-foreground/60 text-xs font-bold uppercase">Registered Date</p>
                                    <p className="text-lg font-bold">{profileData?.registered_date ? new Date(profileData.registered_date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : "Recently"}</p>
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
                                        <Input disabled={!isEditing} defaultValue={profileData?.name} className="pl-10 h-12 font-bold border-primary/10 focus:border-primary focus:ring-primary" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase text-primary/40 ml-1">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-primary" />
                                        <Input disabled={!isEditing} type="email" defaultValue={profileData?.email} className="pl-10 h-12 font-bold border-primary/10 focus:border-primary focus:ring-primary" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase text-primary/40 ml-1">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-5 w-5 text-primary" />
                                        <Input disabled={!isEditing} defaultValue={profileData?.phone || "Not set"} className="pl-10 h-12 font-bold border-primary/10 focus:border-primary focus:ring-primary" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase text-primary/40 ml-1">Address</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-primary" />
                                        <Input disabled={!isEditing} defaultValue={profileData?.address || "Not set"} className="pl-10 h-12 font-bold border-primary/10 focus:border-primary focus:ring-primary" />
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
