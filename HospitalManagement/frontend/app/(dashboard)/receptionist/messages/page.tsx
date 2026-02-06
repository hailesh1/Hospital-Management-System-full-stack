"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { NewConversationDialog } from "@/components/messages/new-conversation-dialog"
import { formatDistanceToNow } from "date-fns"

export default function ReceptionistMessagesPage() {
    const [selectedChat, setSelectedChat] = useState(0)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [chats, setChats] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/messages')
            if (res.ok) {
                const data = await res.json()
                // Group messages by sender/receiver to form "chats"
                // For simplicity MVP, we'll just list individual messages as "chats" for now
                // deeply grouping requires more complex logic or a proper conversations table

                const formattedChats = data.map((msg: any) => ({
                    id: msg.id,
                    name: msg.sender_name || 'Unknown',
                    lastMsg: msg.content,
                    time: formatDistanceToNow(new Date(msg.created_at), { addSuffix: true }),
                    online: true // Mock online status
                }))
                setChats(formattedChats)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMessages()
    }, [])

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col gap-6">
            <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-xl border border-red-50">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-gray-900 border-l-8 border-red-600 pl-4">Staff Messenger</h1>
                </div>
                <Button
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-red-600 text-white rounded-2xl h-12 px-6 font-black shadow-lg shadow-red-200"
                >
                    <Icons.plus className="mr-2 h-4 w-4" /> New Conversation
                </Button>
            </div>

            <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
                <Card className="col-span-4 border-none shadow-2xl overflow-hidden bg-white flex flex-col">
                    <CardHeader className="bg-red-50 border-b border-red-100 p-6">
                        <div className="relative group">
                            <Icons.search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-300" />
                            <Input placeholder="Search staff..." className="pl-10 bg-white border-red-100 rounded-xl" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 overflow-y-auto">
                        {loading ? (
                            <div className="p-6 text-center text-muted-foreground">Loading messages...</div>
                        ) : chats.length === 0 ? (
                            <div className="p-6 text-center text-muted-foreground">No messages found. Start a new conversation!</div>
                        ) : (
                            chats.map((chat, i) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedChat(i)}
                                    className={cn(
                                        "p-6 flex items-center gap-4 cursor-pointer transition-all border-b border-red-50",
                                        selectedChat === i ? "bg-red-600 text-white" : "hover:bg-red-50"
                                    )}
                                >
                                    <div className="relative">
                                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center font-black text-gray-600">
                                            {chat.name.charAt(0)}
                                        </div>
                                        {chat.online && <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <h4 className="font-black truncate">{chat.name}</h4>
                                            <span className={cn("text-[10px] font-bold uppercase", selectedChat === i ? "text-red-100" : "text-muted-foreground")}>{chat.time}</span>
                                        </div>
                                        <p className={cn("text-xs truncate", selectedChat === i ? "text-red-50" : "text-muted-foreground")}>{chat.lastMsg}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-8 border-none shadow-2xl overflow-hidden bg-white flex flex-col relative">
                    {chats.length > 0 && chats[selectedChat] ? (
                        <>
                            <div className="absolute top-0 right-0 -m-20 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
                            <CardHeader className="p-6 border-b border-red-50 flex flex-row items-center justify-between relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-red-600 flex items-center justify-center font-black text-white shadow-lg">
                                        {chats[selectedChat].name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-lg">{chats[selectedChat].name}</h3>
                                        <Badge variant="outline" className="text-[10px] font-black uppercase text-green-600 border-green-200 bg-green-50">Online Now</Badge>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl"><Icons.phone className="h-5 w-5" /></Button>
                                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl"><Icons.video className="h-5 w-5" /></Button>
                                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl"><Icons.moreVertical className="h-5 w-5" /></Button>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 p-8 overflow-y-auto flex flex-col gap-4 relative z-10 bg-slate-50/30">
                                <div className="text-center p-20 opacity-40">
                                    <Icons.messageSquare className="h-16 w-16 mx-auto mb-4 text-red-200" />
                                    <p className="font-black uppercase tracking-widest text-xs">Beginning of conversation with {chats[selectedChat].name}</p>
                                </div>
                                <div className="self-start bg-white p-4 rounded-2xl rounded-tl-none shadow-sm max-w-md">
                                    <p className="text-sm font-medium text-gray-800">{chats[selectedChat].lastMsg}</p>
                                    <span className="text-[10px] text-gray-400 mt-1 block">{chats[selectedChat].time}</span>
                                </div>
                            </CardContent>
                            <div className="p-6 border-t border-red-50 bg-white relative z-10">
                                <div className="flex gap-4">
                                    <Input placeholder="Type your message here..." className="h-14 rounded-2xl border-red-100 focus:ring-red-600/20 px-6 font-medium" />
                                    <Button className="h-14 w-14 rounded-2xl bg-red-600 text-white shadow-xl shadow-red-200 hover:scale-105 active:scale-95 transition-all">
                                        <Icons.send className="h-6 w-6" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground">
                            Select a chat or start a new conversation
                        </div>
                    )}
                </Card>
            </div>

            <NewConversationDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
        </div>
    )
}
