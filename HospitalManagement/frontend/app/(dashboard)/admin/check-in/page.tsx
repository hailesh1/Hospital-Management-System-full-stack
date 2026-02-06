"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"

export default function AdminCheckInPage() {
    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl border border-emerald-50">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white flex items-center">
                        Front Desk Traffic <span className="ml-3 px-3 py-1 bg-emerald-500 text-white text-xs rounded-full uppercase tracking-tighter">Live Monitor</span>
                    </h1>
                    <p className="text-lg font-medium text-muted-foreground mt-2">
                        Supervising <span className="text-emerald-600 font-bold">patient check-ins</span> and wait times across the facility.
                    </p>
                </div>
            </div>

            <Card className="border-none shadow-2xl overflow-hidden bg-white">
                <CardHeader className="bg-emerald-600 p-8">
                    <div className="flex items-center justify-between">
                        <div className="relative w-full md:max-w-md group">
                            <Icons.search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-200" />
                            <Input
                                placeholder="Search check-in history..."
                                className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-emerald-100 rounded-xl font-bold"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8 text-center py-20">
                    <Icons.activity className="h-16 w-16 text-emerald-100 mx-auto mb-6" />
                    <h3 className="text-xl font-black text-emerald-900">Check-In Queue Management</h3>
                    <p className="text-muted-foreground mt-2">The system is currently monitoring 12 active check-ins across all departments.</p>
                </CardContent>
            </Card>
        </div>
    )
}
