"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"

export default function AdminMessagesPage() {
    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-10 h-[calc(100vh-120px)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl border border-emerald-50">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white flex items-center">
                        Internal Comms <span className="ml-3 px-3 py-1 bg-emerald-500 text-white text-xs rounded-full uppercase tracking-tighter">System-Wide</span>
                    </h1>
                    <p className="text-lg font-medium text-muted-foreground mt-2">
                        Supervision of <span className="text-emerald-600 font-bold">staff and patient</span> communication channels.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6 h-full pb-20">
                <Card className="col-span-4 border-none shadow-xl overflow-hidden flex flex-col">
                    <CardHeader className="bg-emerald-600 p-6 text-white font-black">Conversations</CardHeader>
                    <CardContent className="p-0 overflow-y-auto flex-1">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="p-4 border-b hover:bg-emerald-50 cursor-pointer transition-colors border-emerald-50">
                                <p className="font-black text-emerald-900 text-sm">Staff Announcement</p>
                                <p className="text-xs text-muted-foreground truncate">Meeting moved to 3 PM in Conference Hall A</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="col-span-8 border-none shadow-xl overflow-hidden flex flex-col bg-white">
                    <CardHeader className="p-6 border-b border-emerald-50 flex flex-row items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center font-black text-emerald-600">S</div>
                        <div>
                            <p className="font-black text-sm">Staff General Channel</p>
                            <p className="text-[10px] uppercase font-bold text-emerald-500 tracking-widest">Administrator Supervision Active</p>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 p-6 flex flex-col">
                        <div className="flex-1 space-y-4">
                            <div className="bg-emerald-50 p-4 rounded-2xl rounded-tl-none self-start max-w-md">
                                <p className="text-sm">Welcome to the central communication hub. As an administrator, you have visibility over all internal channels.</p>
                            </div>
                        </div>
                        <div className="mt-auto flex gap-3 pt-6 border-t border-emerald-50">
                            <Input className="h-12 rounded-xl focus:ring-emerald-500 border-emerald-100 font-bold" placeholder="Broadcast a message to all staff..." />
                            <Button className="h-12 w-12 rounded-xl bg-emerald-600 hover:bg-emerald-700">
                                <Icons.send className="h-5 w-5" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
