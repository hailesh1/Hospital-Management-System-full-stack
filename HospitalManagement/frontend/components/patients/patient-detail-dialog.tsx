"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Eye, Mail, Phone, Calendar, Droplet, User, MapPin, AlertCircle } from "lucide-react"
import { MedicalHistoryDialog } from "./medical-history-dialog"

interface Patient {
  id: string
  name: string
  email: string
  phone: string
  age: number
  gender: string
  bloodType: string
  lastVisit: string
  status: string
  address?: string
}

export function PatientDetailDialog({ patient }: { patient: Patient }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Eye className="h-4 w-4" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
          <DialogDescription>Complete information for {patient.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {patient.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-foreground">{patient.name}</h3>
              <p className="text-muted-foreground font-mono">{patient.id}</p>
              <Badge
                variant="secondary"
                className={
                  patient.status === "active"
                    ? "bg-green-500/10 text-green-700 dark:text-green-400 mt-2"
                    : "bg-gray-500/10 text-gray-700 dark:text-gray-400 mt-2"
                }
              >
                {patient.status}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground">{patient.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone (+251)</p>
                  <p className="text-sm font-medium text-foreground">{patient.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Age / Gender</p>
                  <p className="text-sm font-medium text-foreground">
                    {patient.age} years / {patient.gender}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Droplet className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Blood Type</p>
                  <p className="text-sm font-medium text-foreground font-mono">{patient.bloodType}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Last Visit</p>
                  <p className="text-sm font-medium text-foreground">{patient.lastVisit}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="text-sm font-medium text-foreground">{patient.address || 'No address on file'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex items-start gap-3 p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Medical Notes</p>
                <p className="text-sm text-muted-foreground mt-1">
                  No allergies reported. Regular checkups recommended.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline">Edit Information</Button>
            <MedicalHistoryDialog patientName={patient.name} patientId={patient.id} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
