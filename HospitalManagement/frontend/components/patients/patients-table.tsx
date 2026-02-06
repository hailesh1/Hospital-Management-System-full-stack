"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Filter, MoreVertical, Edit } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PatientDetailDialog } from "./patient-detail-dialog"
import { EditPatientDialog } from "./edit-patient-dialog"
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
import { Trash2 } from "lucide-react"

interface PatientsTableProps {
  newPatients?: any[]
  onPatientUpdated?: (updatedPatient: any) => void
  onPatientDeleted?: (id: string) => void
  hideId?: boolean
  enableDelete?: boolean
}

export function PatientsTable({ newPatients = [], onPatientUpdated, onPatientDeleted, hideId = false, enableDelete = false }: PatientsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editingPatient, setEditingPatient] = useState<any>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filteredPatients = newPatients.filter((patient) => {
    const matchesSearch =
      (patient.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (String(patient.id || "")?.toLowerCase()).includes(searchTerm.toLowerCase()) ||
      (patient.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || patient.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients by name, ID, or email..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {newPatients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No patients added yet. Click "Add Patient" to get started.</p>
          </div>
        ) : (
          <>
            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    {!hideId && <TableHead>Patient ID</TableHead>}
                    <TableHead>Contact</TableHead>
                    <TableHead>Age / Gender</TableHead>
                    <TableHead>Blood Type</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id} className="transition-all duration-200 hover:bg-muted/50 hover:shadow-sm">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {patient.name
                                ? patient.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")
                                : "P"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{patient.name}</p>
                            <p className="text-sm text-muted-foreground">{patient.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      {!hideId && <TableCell className="font-mono text-sm">{patient.id}</TableCell>}
                      <TableCell className="text-sm">{patient.phone}</TableCell>
                      <TableCell className="text-sm">
                        {patient.age} / {patient.gender}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {patient.bloodType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{patient.lastVisit}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            patient.status === "active"
                              ? "bg-green-500/10 text-green-700 dark:text-green-400"
                              : "bg-gray-500/10 text-gray-700 dark:text-gray-400"
                          }
                        >
                          {patient.status}
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
                            <PatientDetailDialog patient={patient} />
                            <DropdownMenuItem onSelect={(e) => {
                              e.preventDefault()
                              setEditingPatient(patient)
                            }}>
                              Edit Patient
                            </DropdownMenuItem>
                            {enableDelete && (
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onSelect={(e) => {
                                  e.preventDefault()
                                  setDeleteId(patient.id)
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Patient
                              </DropdownMenuItem>
                            )}
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
                Showing {filteredPatients.length} of {newPatients.length} patients
              </p>
            </div>

            {editingPatient && (
              <EditPatientDialog
                patient={editingPatient}
                open={!!editingPatient}
                onOpenChange={(open) => !open && setEditingPatient(null)}
                onPatientUpdated={(updated) => {
                  onPatientUpdated?.(updated)
                  setEditingPatient(null)
                }}
              />
            )}

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the patient record.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => {
                      if (deleteId) {
                        onPatientDeleted?.(deleteId)
                        setDeleteId(null)
                      }
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </CardContent>
    </Card>
  )
}
