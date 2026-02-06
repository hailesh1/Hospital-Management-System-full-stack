 "use client"
 
 import { useEffect, useState } from "react"
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
 import { Badge } from "@/components/ui/badge"
 import { Input } from "@/components/ui/input"
 import { Filter } from "lucide-react"
 import { AddPrescriptionDialog } from "@/components/appointments/add-prescription-dialog"
 
 interface Prescription {
   id: string
   patientId: string
   patientName: string
   medicationName: string
   dosage?: string
   frequency?: string
   duration?: string
   prescribedBy?: string
   prescribedDate?: string | null
   status?: string
   refillsRemaining?: number
   notes?: string
 }
 
 export default function DoctorPrescriptionsPage() {
   const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
   const [search, setSearch] = useState("")
 
   useEffect(() => {
     const load = async () => {
       try {
         const res = await fetch("/api/prescriptions")
         if (res.ok) {
           const data = await res.json()
           setPrescriptions(data)
         }
       } catch (e) {
         console.error("Failed to load prescriptions", e)
       }
     }
     load()
   }, [])
 
   const refreshPrescriptions = async () => {
     try {
       const res = await fetch("/api/prescriptions")
       if (res.ok) {
         const data = await res.json()
         setPrescriptions(data)
       }
     } catch (e) {
       console.error("Failed to refresh prescriptions", e)
     }
   }
 
   const filtered = prescriptions.filter(p =>
     (p.patientName || "").toLowerCase().includes(search.toLowerCase()) ||
     (p.medicationName || "").toLowerCase().includes(search.toLowerCase()) ||
     (p.id || "").toLowerCase().includes(search.toLowerCase())
   )
 
   return (
     <div className="space-y-6">
       <div>
         <h1 className="text-3xl font-bold">Prescriptions</h1>
         <p className="text-muted-foreground">View and manage prescriptions.</p>
       </div>
 
       <Card>
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <Filter className="h-4 w-4" />
             Prescriptions List
           </CardTitle>
         </CardHeader>
         <CardContent>
           <div className="flex flex-col gap-4 mb-4">
             <Input
               placeholder="Search by patient, medication, or ID..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
               <AddPrescriptionDialog
                 onPrescriptionAdded={async () => {
                   await refreshPrescriptions()
                 }}
               />
             </div>
           </div>
           <div className="rounded-md border border-border overflow-hidden">
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>ID</TableHead>
                   <TableHead>Patient</TableHead>
                   <TableHead>Medication</TableHead>
                   <TableHead>Dosage</TableHead>
                   <TableHead>Frequency</TableHead>
                   <TableHead>Duration</TableHead>
                   <TableHead>Status</TableHead>
                   <TableHead>Prescribed</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {filtered.map(p => (
                   <TableRow key={p.id}>
                     <TableCell className="font-mono text-sm">{p.id}</TableCell>
                     <TableCell>
                       <div className="flex flex-col">
                         <span className="font-medium">{p.patientName}</span>
                         <span className="text-xs text-muted-foreground font-mono">{p.patientId}</span>
                       </div>
                     </TableCell>
                     <TableCell>{p.medicationName}</TableCell>
                     <TableCell>{p.dosage || "-"}</TableCell>
                     <TableCell>{p.frequency || "-"}</TableCell>
                     <TableCell>{p.duration || "-"}</TableCell>
                     <TableCell>
                       <Badge variant="secondary">{p.status || "active"}</Badge>
                     </TableCell>
                     <TableCell>{p.prescribedDate || "-"}</TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </div>
         </CardContent>
       </Card>
     </div>
   )
 }
