"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, Phone, Calendar, Building2, Briefcase, Award } from "lucide-react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { format } from "date-fns"

interface StaffDetailDialogProps {
  staff: any
}

export function StaffDetailDialog({ staff }: StaffDetailDialogProps) {
  const roleColors = {
    DOCTOR: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    NURSE: "bg-green-500/10 text-green-700 dark:text-green-400",
    ADMIN: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
    RECEPTIONIST: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>View Profile</DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Staff Member Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {staff.first_name?.[0]}{staff.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-foreground">{staff.first_name} {staff.last_name}</h3>
              <p className="text-muted-foreground font-mono text-sm">{staff.id}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className={roleColors[staff.role as keyof typeof roleColors]}>
                  {staff.role}
                </Badge>
                <Badge
                  variant="secondary"
                  className={
                    {
                      ACTIVE: "bg-green-500/10 text-green-700 dark:text-green-400",
                      BUSY: "bg-red-500/10 text-red-700 dark:text-red-400",
                      AWAY: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
                      INACTIVE: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
                    }[staff.status as string] || "bg-gray-500/10 text-gray-700 dark:text-gray-400"
                  }
                >
                  {staff.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Email Address</p>
                  <p className="text-sm font-medium text-foreground">{staff.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone Number (+251)</p>
                  <p className="text-sm font-medium text-foreground">{staff.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Join Date</p>
                  <p className="text-sm font-medium text-foreground">
                    {staff.join_date ? format(new Date(staff.join_date), "MMM dd, yyyy") : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Building2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="text-sm font-medium text-foreground">{staff.department_name || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Briefcase className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Role</p>
                  <p className="text-sm font-medium text-foreground capitalize">{staff.role}</p>
                </div>
              </div>

              {staff.specialization && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Award className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Specialization</p>
                    <p className="text-sm font-medium text-foreground">{staff.specialization}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
