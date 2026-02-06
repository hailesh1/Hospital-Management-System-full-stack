"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Filter, Edit, MoreVertical, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { StaffDetailDialog } from "./staff-detail-dialog"
import { EditStaffDialog } from "./edit-staff-dialog"
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
import { format } from "date-fns"
import { toast } from "sonner"

const roleColors = {
  DOCTOR: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  NURSE: "bg-green-500/10 text-green-700 dark:text-green-400",
  ADMIN: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  RECEPTIONIST: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
}

const statusColors = {
  ACTIVE: "bg-green-500/10 text-green-700 dark:text-green-400",
  BUSY: "bg-red-500/10 text-red-700 dark:text-red-400",
  AWAY: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  INACTIVE: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
}

interface StaffTableProps {
  newStaff?: any[]
  onUpdate?: () => void
}

export function StaffTable({ newStaff = [], onUpdate }: StaffTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [editingStaff, setEditingStaff] = useState<any | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = (staff: any) => {
    setEditingStaff(staff)
    setEditDialogOpen(true)
  }

  const handleUpdateStaff = () => {
    if (onUpdate) {
      onUpdate()
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/staff/${deleteId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success("Staff member deleted successfully")
        if (onUpdate) onUpdate()
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to delete staff member")
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("An error occurred while deleting")
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const filteredStaff = newStaff.filter((staff) => {
    const firstName = staff.first_name || ""
    const lastName = staff.last_name || ""
    const fullName = `${firstName} ${lastName}`.toLowerCase()
    const id = staff.id || ""
    const email = staff.email || ""
    const departmentName = staff.department_name || ""

    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      departmentName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || (staff.role?.toUpperCase() === roleFilter.toUpperCase())

    return matchesSearch && matchesRole
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search staff by name, ID, email, or department..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="DOCTOR">Doctors</SelectItem>
              <SelectItem value="NURSE">Nurses</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {newStaff.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No staff members found. Click "Add Staff Member" to get started.
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {(staff.first_name?.[0] || "")}{(staff.last_name?.[0] || "")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{staff.first_name || "Unknown"} {staff.last_name || "Staff"}</p>
                            <p className="text-xs text-muted-foreground font-mono">{staff.id?.slice(0, 8) || "N/A"}...</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{staff.email}</p>
                        <p className="text-xs text-muted-foreground">{staff.phone}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={roleColors[staff.role as keyof typeof roleColors]}>
                          {staff.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{staff.department_name || "N/A"}</TableCell>
                      <TableCell className="text-sm">{staff.specialization || "N/A"}</TableCell>
                      <TableCell className="text-sm">
                        {staff.join_date ? format(new Date(staff.join_date), "MMM dd, yyyy") : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={statusColors[staff.status as keyof typeof statusColors]}>
                          {staff.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <StaffDetailDialog staff={staff} />
                            <DropdownMenuItem onClick={() => handleEdit(staff)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600 focus:bg-red-50"
                              onClick={() => setDeleteId(staff.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Staff
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredStaff.length} of {newStaff.length} staff members
              </p>
            </div>
          </>
        )}
      </CardContent>
      <EditStaffDialog
        staff={editingStaff}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdate={handleUpdateStaff}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && !isDeleting && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the staff member
              and remove their access to the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Staff"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
