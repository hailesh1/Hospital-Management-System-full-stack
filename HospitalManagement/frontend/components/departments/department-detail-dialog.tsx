"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Users, Layout, Activity, MapPin } from "lucide-react"

interface DepartmentDetailDialogProps {
    department: any
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function DepartmentDetailDialog({ department, open, onOpenChange }: DepartmentDetailDialogProps) {
    if (!department) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-2xl">{department.name}</DialogTitle>
                        <Badge>{department.status}</Badge>
                    </div>
                    <DialogDescription>
                        Department ID: {department.id}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm font-medium leading-relaxed">
                            {department.description}
                        </p>
                    </div>

                    <div className="grid gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                <Activity className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Head of Department</p>
                                <p className="font-medium">{department.head}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Staff Count</p>
                                <p className="font-medium">{department.staffCount} Members</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Location</p>
                                <p className="font-medium">{department.location}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
