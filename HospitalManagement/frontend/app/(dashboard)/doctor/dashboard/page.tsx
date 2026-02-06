"use client"

import { DashboardCard } from "@/components/dashboard-card"
import { Icons } from "@/components/ui/icons"
import { AddPrescriptionDialog } from "@/components/lab/add-prescription-dialog"
import { OrderLabTestDialog } from "@/components/lab/order-lab-test-dialog"
import { UploadRecordDialog } from "@/components/records/upload-record-dialog"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"

export default function DoctorDashboardPage() {
  const { user } = useAuth()
  const [showPrescriptionDialog, setShowPrescriptionDialog] = useState(false)
  const [showLabTestDialog, setShowLabTestDialog] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [stats, setStats] = useState({
    appointmentsToday: 0,
    patientsWaiting: 0,
    medicalRecords: 0,

    messages: 5, // Static for now
  })
  const [status, setStatus] = useState<string>("AVAILABLE")


  const [appointments, setAppointments] = useState<any[]>([])
  const [recentPatients, setRecentPatients] = useState<any[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard/stats')
        const data = await res.json()
        setStats(prev => ({
          ...prev,
          appointmentsToday: data.appointmentsToday || 0,
          patientsWaiting: prev.patientsWaiting,
          medicalRecords: data.medicalRecords || 0,
        }))

        // Fetch current status
        if (user?.id) {
          const statusRes = await fetch(`/api/staff/${user.id}`)
          if (statusRes.ok) {
            const statusData = await statusRes.json()
            setStatus(statusData.availabilityStatus || "AVAILABLE")
          }
        }

        const apptRes = await fetch(`/api/dashboard/appointments${user?.id ? `?doctor_id=${user.id}` : ''}`)
        if (apptRes.ok) {
          const apptData = await apptRes.json()
          setAppointments(apptData)
          const waitingStatuses = new Set(['SCHEDULED', 'CHECKED_IN', 'WAITING'])
          const waitingCount = Array.isArray(apptData)
            ? apptData.filter((a: any) => waitingStatuses.has(String(a.status || '').toUpperCase())).length
            : 0
          setStats(prev => ({
            ...prev,
            patientsWaiting: waitingCount
          }))
        }

        const recentRes = await fetch('/api/dashboard/recent-patients')
        if (recentRes.ok) {
          const recentData = await recentRes.json()
          setRecentPatients(recentData)
        }

      } catch (error) {
        console.error("Failed to fetch doctor stats:", error)
      }
    }
    fetchStats()
  }, [user?.id])

  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/staff/${user?.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setStatus(newStatus)
      }
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, Dr. Kebede! Here's your schedule for today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          <select
            className="p-2 border rounded-md text-sm bg-background"
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="AVAILABLE">Available</option>
            <option value="BUSY">Busy</option>
            <option value="IN_PERSONAL_BREAK">In Break</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Today's Appointments"
          value={stats.appointmentsToday.toString()}
          description="View your schedule"
          icon="calendar"
          href="/doctor/appointments"
        />
        <DashboardCard
          title="Patients Waiting"
          value={stats.patientsWaiting.toString()}
          description="In waiting room"
          icon="users"
          href="/doctor/patients"
        />
        <DashboardCard
          title="Medical Records"
          value={stats.medicalRecords.toString()}
          description="Total records"
          icon="fileText"
          href="/doctor/medical-records"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm col-span-4 p-6">
          <h3 className="text-lg font-medium mb-4">Today's Schedule</h3>
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <p className="text-muted-foreground text-sm">No appointments scheduled for today.</p>
            ) : (appointments.map((appt, i) => (
              <div key={i} className="flex items-center p-3 border rounded-lg hover:bg-accent/50">
                <div className="w-24 text-sm font-medium">{appt.time}</div>
                <div className="flex-1">
                  <p className="font-medium">{appt.patientName}</p>
                  <p className="text-sm text-muted-foreground">{appt.type}</p>
                </div>
                <button className="p-2 rounded-full hover:bg-muted">
                  <Icons.moreHorizontal className="h-4 w-4" />
                </button>
              </div>
            )))}
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm col-span-3 p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => setShowUploadDialog(true)}
                className="w-full flex items-center p-3 rounded-lg border hover:bg-accent/50 text-sm font-medium"
              >
                <Icons.plus className="mr-2 h-4 w-4" />
                New Patient Record
              </button>
              <button
                onClick={() => setShowPrescriptionDialog(true)}
                className="w-full flex items-center p-3 rounded-lg border bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary text-sm font-medium transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
              >
                <Icons.fileText className="mr-2 h-4 w-4" />
                Write Prescription
              </button>
              <button
                onClick={() => setShowLabTestDialog(true)}
                className="w-full flex items-center p-3 rounded-lg border bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary text-sm font-medium transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
              >
                <Icons.flaskConical className="mr-2 h-4 w-4" />
                Order Lab Test
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Recent Patients</h3>
            <div className="space-y-3">
              {recentPatients.length === 0 ? (
                <p className="text-muted-foreground text-sm">No recent patients found.</p>
              ) : (recentPatients.map((patient, i) => (
                <div key={i} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent/50">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <Icons.user className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{patient.name}</p>
                    <p className="text-xs text-muted-foreground">Last visit: {patient.visit}</p>
                  </div>
                </div>
              )))}
            </div>
          </div>
        </div>
      </div>


      <AddPrescriptionDialog
        open={showPrescriptionDialog}
        onOpenChange={setShowPrescriptionDialog}
        onAdd={async (data) => {
          try {
            const res = await fetch('/api/prescriptions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            })
            if (res.ok) {
              alert("Prescription added successfully!")
              setShowPrescriptionDialog(false)
            } else {
              const err = await res.json()
              alert(`Error: ${err.details || err.error}`)
            }
          } catch (error) {
            console.error("Failed to add prescription:", error)
          }
        }}
      />

      <OrderLabTestDialog
        open={showLabTestDialog}
        onOpenChange={setShowLabTestDialog}
        onAdd={async (data) => {
          try {
            const res = await fetch('/api/lab-tests', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            })
            if (res.ok) {
              alert("Lab test ordered successfully!")
              setShowLabTestDialog(false)
            } else {
              const err = await res.json()
              alert(`Error: ${err.details || err.error}`)
            }
          } catch (error) {
            console.error("Failed to order lab test:", error)
          }
        }}
      />

      <UploadRecordDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        onUploadRecord={async (newRecord) => {
          try {
            const res = await fetch('/api/medical-records', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                patientId: newRecord.patientId,
                title: newRecord.title,
                type: newRecord.type,
                description: newRecord.description,
                fileName: newRecord.fileName,
                doctorId: user?.id,
                doctorName: user?.name
              }),
            });

            if (res.ok) {
              alert("Medical record uploaded successfully!")
              setShowUploadDialog(false);
              // Refresh stats
              const statsRes = await fetch('/api/dashboard/stats')
              const statsData = await statsRes.json()
              setStats(prev => ({
                ...prev,
                medicalRecords: statsData.medicalRecords || 0,
              }))
            } else {
              const errorData = await res.json();
              alert(`Failed to save record: ${errorData.details || errorData.error}`);
            }
          } catch (error) {
            console.error("Error saving record:", error);
          }
        }}
      />
    </div >
  )
}
