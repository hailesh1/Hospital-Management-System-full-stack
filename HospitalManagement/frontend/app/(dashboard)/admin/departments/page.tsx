"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Users, Layout, Activity, Loader2, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DepartmentDetailDialog } from "@/components/departments/department-detail-dialog"
import { toast } from "sonner"

// Simple Add Department Dialog (Inline for speed, can be extracted)
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function AdminDepartmentsPage() {
    const [departments, setDepartments] = useState<any[]>([])
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [selectedDept, setSelectedDept] = useState<any>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [formData, setFormData] = useState({ name: "", description: "" })

    const fetchDepartments = useCallback(async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/departments')
            if (!response.ok) throw new Error('Failed to fetch departments')
            const data = await response.json()
            setDepartments(data)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load departments")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchDepartments()
    }, [fetchDepartments])

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const response = await fetch('/api/departments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!response.ok) throw new Error('Failed to create department')

            toast.success("Department created successfully")
            setIsAddOpen(false)
            setFormData({ name: "", description: "" })
            fetchDepartments()
        } catch (error) {
            console.error(error)
            toast.error("Failed to create department")
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteDepartment = async (id: string) => {
        try {
            const response = await fetch(`/api/departments?id=${id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to delete department')
            }

            toast.success("Department deleted successfully")
            fetchDepartments()
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || "Failed to delete department")
        } finally {
            setDeleteId(null)
        }
    }


    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl shadow-emerald-900/5 border border-emerald-50 dark:border-emerald-900/20">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white flex items-center">
                        Departments
                        <span className="ml-3 px-3 py-1 bg-emerald-500 text-white text-xs rounded-full uppercase tracking-tighter animate-pulse">Live</span>
                    </h1>
                    <p className="text-lg font-medium text-muted-foreground mt-2">
                        Manage <span className="text-emerald-600 font-bold">hospital departments</span> and units.
                    </p>
                </div>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-600 text-white hover:bg-emerald-700 font-black h-14 px-8 rounded-2xl shadow-xl shadow-emerald-200 transition-all hover:scale-105 active:scale-95 group">
                            <Plus className="mr-3 h-5 w-5 transition-transform group-hover:rotate-90" />
                            Add Department
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Department</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Department Name</Label>
                                <Input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Oncology" />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Brief description..." />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={submitting}>
                                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Add Department
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {departments.map((dept) => (
                        <Card
                            key={dept.id}
                            className="cursor-pointer hover:shadow-2xl hover:shadow-emerald-500/20 hover:scale-[1.02] hover:border-emerald-500 transition-all duration-300 border-t-4 border-t-emerald-500 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 relative overflow-hidden group"
                            onClick={() => setSelectedDept(dept)}
                        >
                            <div className="absolute top-0 right-0 -m-2 w-12 h-12 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all duration-500" />
                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity" />

                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                                <CardTitle className="text-xl font-bold group-hover:text-emerald-700 transition-colors uppercase tracking-tight">{dept.name}</CardTitle>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 z-20"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDeleteId(dept.id);
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <div className="h-8 w-8 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                                        <Layout className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="text-sm text-muted-foreground mb-4 line-clamp-2 h-10">
                                    {dept.description}
                                </div>
                                <div className="grid gap-2 mt-4 pt-4 border-t border-dashed">
                                    <div className="flex items-center text-sm">
                                        <Users className="mr-2 h-4 w-4 text-emerald-500" />
                                        <span className="font-medium">{dept.staff_count || 0} Staff Members</span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <Activity className="mr-2 h-4 w-4 text-emerald-500" />
                                        <span>Status: <span className="font-medium text-emerald-700 dark:text-emerald-400">Active</span></span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {departments.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-muted/20 rounded-3xl border border-dashed">
                            <p className="text-muted-foreground">No departments found. Create your first one!</p>
                        </div>
                    )}
                </div>
            )}

            <DepartmentDetailDialog
                department={selectedDept}
                open={!!selectedDept}
                onOpenChange={(open) => !open && setSelectedDept(null)}
            />

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {deleteId && departments.find(d => d.id === deleteId)?.staff_count > 0
                                ? "Cannot Delete Department"
                                : "Are you sure?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {deleteId && departments.find(d => d.id === deleteId)?.staff_count > 0
                                ? `This department has ${departments.find(d => d.id === deleteId)?.staff_count} staff members assigned to it. You must reassign or remove the staff before deleting this department.`
                                : "This action cannot be undone. This will permanently delete the department."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        {deleteId && departments.find(d => d.id === deleteId)?.staff_count > 0 ? (
                            <Button className="bg-emerald-600 text-white" onClick={() => setDeleteId(null)}>
                                Understood
                            </Button>
                        ) : (
                            <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => {
                                    if (deleteId) {
                                        handleDeleteDepartment(deleteId)
                                    }
                                }}
                            >
                                Delete
                            </AlertDialogAction>
                        )}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
