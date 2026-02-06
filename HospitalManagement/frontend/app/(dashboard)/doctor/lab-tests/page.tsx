 "use client"
 
 import { useEffect, useState } from "react"
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
 import { Badge } from "@/components/ui/badge"
 import { Input } from "@/components/ui/input"
 import { Filter } from "lucide-react"
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
 import { useAuth } from "@/contexts/auth-context"
 import { OrderLabTestDialog } from "@/components/appointments/order-lab-test-dialog"
 
 interface LabTest {
   id: string
   patientId: string
   patientName: string
   testName: string
   testType?: string
   orderedBy?: string
   orderedDate?: string | null
   status?: string
   result?: string
   notes?: string
 }
 
 export default function DoctorLabTestsPage() {
   const [labTests, setLabTests] = useState<LabTest[]>([])
   const [search, setSearch] = useState("")
   const { user } = useAuth()
   const [patients, setPatients] = useState<any[]>([])
   const [loadingPatients, setLoadingPatients] = useState(false)
   const [selectedPatientId, setSelectedPatientId] = useState<string>("")
   const [selectedPatientName, setSelectedPatientName] = useState<string>("")
 
   useEffect(() => {
     const load = async () => {
       try {
         const res = await fetch("/api/lab-tests")
         if (res.ok) {
           const data = await res.json()
           setLabTests(data)
         }
       } catch (e) {
         console.error("Failed to load lab tests", e)
       }
     }
     load()
   }, [])
 
   useEffect(() => {
     const fetchPatients = async () => {
       setLoadingPatients(true)
       try {
         const res = await fetch("/api/patients")
         if (res.ok) {
           const data = await res.json()
           setPatients(data)
         }
       } catch (e) {
         console.error("Failed to load patients", e)
       } finally {
         setLoadingPatients(false)
       }
     }
     fetchPatients()
   }, [])
 
   const appointmentForDialog = selectedPatientId
     ? {
         patientId: selectedPatientId,
         patient_name: selectedPatientName,
         doctor_name: user?.name,
         doctor: user?.name,
       }
     : null
 
   const refreshLabTests = async () => {
     try {
       const res = await fetch("/api/lab-tests")
       if (res.ok) {
         const data = await res.json()
         setLabTests(data)
       }
     } catch (e) {
       console.error("Failed to refresh lab tests", e)
     }
   }
 
   const filtered = labTests.filter(t =>
     (t.patientName || "").toLowerCase().includes(search.toLowerCase()) ||
     (t.testName || "").toLowerCase().includes(search.toLowerCase()) ||
     (t.id || "").toLowerCase().includes(search.toLowerCase())
   )
 
   return (
     <div className="space-y-6">
       <div>
         <h1 className="text-3xl font-bold">Lab Tests</h1>
         <p className="text-muted-foreground">View and manage ordered lab tests.</p>
       </div>
 
       <Card>
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <Filter className="h-4 w-4" />
             Lab Tests List
           </CardTitle>
         </CardHeader>
         <CardContent>
           <div className="flex flex-col gap-4 mb-4">
             <Input
               placeholder="Search by patient, test name, or ID..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
               <div className="space-y-2">
                 <label className="text-sm text-muted-foreground" htmlFor="patientSelect">Select Patient</label>
                 <Select
                   value={selectedPatientId}
                   onValueChange={(pid) => {
                     setSelectedPatientId(pid)
                     const p = patients.find((x) => x.id === pid)
                     setSelectedPatientName(p ? p.name : "")
                   }}
                   disabled={loadingPatients}
                 >
                   <SelectTrigger id="patientSelect">
                     <SelectValue placeholder={loadingPatients ? "Loading patients..." : "Select patient"} />
                   </SelectTrigger>
                   <SelectContent className="z-[9999] max-h-[300px]">
                     {patients.length === 0 ? (
                       <div className="p-2 text-sm text-muted-foreground text-center">No patients found.</div>
                     ) : (
                       patients.map((patient) => (
                         <SelectItem key={patient.id} value={patient.id}>
                           {patient.name} ({patient.id})
                         </SelectItem>
                       ))
                     )}
                   </SelectContent>
                 </Select>
               </div>
               <div className="md:col-span-2">
                 {appointmentForDialog && (
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                     <OrderLabTestDialog
                       appointment={appointmentForDialog}
                       onLabTestOrdered={async () => {
                         await refreshLabTests()
                       }}
                     />
                   </div>
                 )}
               </div>
             </div>
           </div>
           <div className="rounded-md border border-border overflow-hidden">
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>ID</TableHead>
                   <TableHead>Patient</TableHead>
                   <TableHead>Test Name</TableHead>
                   <TableHead>Type</TableHead>
                   <TableHead>Ordered By</TableHead>
                   <TableHead>Status</TableHead>
                   <TableHead>Ordered Date</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {filtered.map(t => (
                   <TableRow key={t.id}>
                     <TableCell className="font-mono text-sm">{t.id}</TableCell>
                     <TableCell>
                       <div className="flex flex-col">
                         <span className="font-medium">{t.patientName}</span>
                         <span className="text-xs text-muted-foreground font-mono">{t.patientId}</span>
                       </div>
                     </TableCell>
                     <TableCell>{t.testName}</TableCell>
                     <TableCell>{t.testType || "-"}</TableCell>
                     <TableCell>{t.orderedBy || "-"}</TableCell>
                     <TableCell>
                       <Badge variant="secondary">{t.status || "ordered"}</Badge>
                     </TableCell>
                     <TableCell>{t.orderedDate || "-"}</TableCell>
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
