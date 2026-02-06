"use client"

import { Icons } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { AddPatientDialog } from "@/components/patients/add-patient-dialog"
import { CreateAppointmentDialog } from "@/components/appointments/create-appointment-dialog"
import { CreateInvoiceDialog } from "@/components/billing/create-invoice-dialog"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ReceptionistDashboardPage() {
  const router = useRouter()
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false)
  const [isAddAppointmentOpen, setIsAddAppointmentOpen] = useState(false)
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false)
  const [stats, setStats] = useState({
    waitingArea: 0,
    todayVisits: 0,
    newRegistrations: 0,
    totalRevenue: 0,
  })

  const [appointments, setAppointments] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats
        const statsRes = await fetch('/api/dashboard/stats')
        const statsData = await statsRes.json()

        setStats({
          waitingArea: statsData.appointmentsToday || 0,
          todayVisits: statsData.appointmentsToday || 0,
          newRegistrations: statsData.newToday || 0,
          totalRevenue: statsData.revenue || 0,
        })

        // Fetch today's appointments
        const apptRes = await fetch('/api/dashboard/appointments')
        if (apptRes.ok) {
          const apptData = await apptRes.json()
          // Ensure we always set an array
          setAppointments(Array.isArray(apptData) ? apptData : [])
        } else {
          setAppointments([])
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
        setAppointments([])
      }
    }
    fetchData()
  }, [])

  const handleAddPatient = (patient: any) => {
    setStats(prev => ({ ...prev, newRegistrations: prev.newRegistrations + 1 }))
    setIsAddPatientOpen(false)
  }

  const handleAddAppointment = (appointment: any) => {
    setStats(prev => ({ ...prev, waitingArea: prev.waitingArea + 1 }))
    setIsAddAppointmentOpen(false)
    // Refresh appointments
    fetch('/api/dashboard/appointments')
      .then(res => res.json())
      .then(data => setAppointments(Array.isArray(data) ? data : []))
      .catch(() => setAppointments([]))
  }

  const handleAddInvoice = (invoice: any) => {
    setIsCreateInvoiceOpen(false)
    toast.success("Invoice created successfully")
    // Refresh revenue stat
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => setStats(prev => ({ ...prev, totalRevenue: data.revenue || 0 })))
  }

  const waitingList = Array.isArray(appointments) ? appointments.filter(a => a.status === 'checked_in') : []



  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        setAppointments(prev =>
          prev.map(appt =>
            appt.id === appointmentId ? { ...appt, status: newStatus } : appt
          )
        )
      }
    } catch (error) {
      console.error("Failed to update status", error)
    }
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-xl shadow-red-900/5 border border-red-50">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900 flex items-center">
            Reception Desk <span className="ml-3 px-3 py-1 bg-red-600 text-white text-xs rounded-full uppercase tracking-tighter animate-pulse">Live</span>
          </h1>
          <p className="text-lg font-medium text-muted-foreground mt-2">
            Managing <span className="text-red-600 font-bold">{waitingList.length} patients</span> in the waiting room. Smooth operations today.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() => setIsAddPatientOpen(true)}
            className="bg-white text-red-600 border-2 border-red-100 hover:border-red-600 hover:bg-red-50 font-black h-14 px-8 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 group"
          >
            <Icons.userPlus className="mr-3 h-5 w-5 transition-transform group-hover:rotate-12" />
            Register Patient
          </Button>
          <Button
            onClick={() => setIsAddAppointmentOpen(true)}
            className="bg-red-600 text-white hover:bg-red-700 font-black h-14 px-8 rounded-2xl shadow-xl shadow-red-200 transition-all hover:scale-105 active:scale-95 group"
          >
            <Icons.calendarPlus className="mr-3 h-5 w-5 transition-transform group-hover:scale-125" />
            New Appointment
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Waiting Area", value: waitingList.length.toString(), desc: "Patients Checked In", icon: "users", color: "red-600" },
          { title: "Today's Visits", value: stats.todayVisits.toString(), desc: "Scheduled total", icon: "calendar", color: "red-500" },
          { title: "New Registrations", value: stats.newRegistrations.toString(), desc: "Total patients", icon: "userPlus", color: "red-400" },
          { title: "Total Revenue", value: `ETB ${stats.totalRevenue.toLocaleString()}`, desc: "Today's collections", icon: "creditCard", color: "red-700" },
        ].map((stat, i) => (
          <Card key={i} className="group border-none shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 hover:scale-[1.03] border-l-4 border-l-red-600 hover:border-l-emerald-500 bg-white overflow-hidden relative">
            <div className="absolute top-0 right-0 -m-4 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-red-900/60">{stat.title}</CardTitle>
              <div className={cn("p-2 rounded-lg shadow-lg text-white transition-transform group-hover:rotate-12", `bg-${stat.color}`)}>
                {stat.icon === "users" && <Icons.users className="h-4 w-4" />}
                {stat.icon === "calendar" && <Icons.calendar className="h-4 w-4" />}
                {stat.icon === "userPlus" && <Icons.userPlus className="h-4 w-4" />}
                {stat.icon === "creditCard" && <Icons.creditCard className="h-4 w-4" />}
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-black tracking-tight text-gray-900">{stat.value}</div>
              <p className="text-xs font-bold text-red-600 mt-1 uppercase tracking-tighter">{stat.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <Card className="lg:col-span-8 border-none shadow-2xl overflow-hidden bg-white/80 backdrop-blur-xl ring-2 ring-red-50 flex flex-col">
          <CardHeader className="bg-red-600 flex flex-row items-center justify-between py-6 px-8 border-b border-red-700">
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-widest">Active Schedule</h3>
              <p className="text-red-100 text-xs font-bold mt-1">Real-time status of all check-ins</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 cursor-pointer">Live Feed</Badge>
              <Badge variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 cursor-pointer">Priority Only</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-red-900/40 border-b border-red-50 bg-red-50/30">
                    <th className="py-5 px-8">Time</th>
                    <th className="py-5 px-4">Patient Name</th>
                    <th className="py-5 px-4">Doctor</th>
                    <th className="py-5 px-4">Type</th>
                    <th className="py-5 px-8 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-50">
                  {appointments.length === 0 ? (
                    <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No appointments for today.</td></tr>
                  ) : appointments.map((appt, i) => (
                    <tr key={i} className="group hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer">
                      <td className="py-6 px-8 flex items-center">
                        <Icons.clock className="h-4 w-4 mr-3 text-red-400 group-hover:text-white" />
                        <span className="text-sm font-black">{appt.time}</span>
                      </td>
                      <td className="py-6 px-4">
                        <div className="text-sm font-black group-hover:text-white transition-colors">{appt.patient_name}</div>
                        <div className="text-[10px] font-bold text-red-600 group-hover:text-red-200 uppercase tracking-widest mt-0.5">ID: P-{appt.patient_id}</div>
                      </td>
                      <td className="py-6 px-4 text-sm font-bold opacity-80 group-hover:opacity-100">{appt.doctor_name}</td>
                      <td className="py-6 px-4">
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-tighter border-red-100 group-hover:border-white group-hover:text-white group-hover:bg-white/10 transition-all">{appt.type}</Badge>
                      </td>
                      <td className="py-6 px-8 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Select
                            value={appt.status}
                            onValueChange={(value) => handleStatusChange(appt.id, value)}
                          >
                            <SelectTrigger className="h-8 w-[140px] border-none bg-transparent hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-right justify-end pr-0 focus:ring-0">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent align="end">
                              <SelectItem value="scheduled">Scheduled</SelectItem>
                              <SelectItem value="checked_in">Checked In</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="overdue">Overdue</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className={cn("h-2.5 w-2.5 rounded-full ring-4 ring-white shadow-lg pointer-events-none",
                            appt.status === 'completed' || appt.status === 'paid' ? 'bg-green-500' :
                              appt.status === 'checked_in' ? 'bg-blue-500' :
                                appt.status === 'in_progress' ? 'bg-yellow-500' :
                                  appt.status === 'overdue' ? 'bg-red-500' :
                                    'bg-gray-400'
                          )} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-red-50/50 text-center border-t border-red-50">
              <Button variant="ghost" className="text-red-600 font-black uppercase tracking-widest text-xs hover:bg-red-600 hover:text-white">View Full Schedule History</Button>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-4 space-y-8">
          <Card className="border-none shadow-2xl overflow-hidden ring-2 ring-red-50 bg-white">
            <CardHeader className="bg-red-600/5 px-8 pt-8 pb-4 border-b border-red-50">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">Reception Actions</h3>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "New Patient", icon: <Icons.userPlus className="h-6 w-6" />, color: "bg-red-600", action: () => setIsAddPatientOpen(true) },
                  { label: "Book Appt", icon: <Icons.calendarPlus className="h-6 w-6" />, color: "bg-red-500", action: () => setIsAddAppointmentOpen(true) },
                  { label: "Create Bill", icon: <Icons.filePlus className="h-6 w-6" />, color: "bg-emerald-600", action: () => setIsCreateInvoiceOpen(true) },
                  { label: "Billing", icon: <Icons.fileText className="h-6 w-6" />, color: "bg-red-400", action: () => router.push("/receptionist/billing") },
                  { label: "Payments", icon: <Icons.creditCard className="h-6 w-6" />, color: "bg-red-700", action: () => router.push("/receptionist/billing") },
                  { label: "Reports", icon: <Icons.activity className="h-6 w-6" />, color: "bg-red-900", action: () => router.push("/receptionist/reports") },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={item.action}
                    className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white border-2 border-red-50 transition-all duration-300 hover:bg-red-600 hover:border-red-600 hover:shadow-2xl group text-center hover:-translate-y-2"
                  >
                    <div className={cn("p-4 rounded-xl text-white shadow-lg group-hover:bg-white group-hover:text-red-600 transition-all duration-500", item.color)}>
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-black text-gray-900 group-hover:text-white transition-colors uppercase tracking-widest mt-4">{item.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>


        </div>
      </div>
      <AddPatientDialog
        open={isAddPatientOpen}
        onOpenChange={setIsAddPatientOpen}
        onPatientAdded={handleAddPatient}
      />
      <CreateAppointmentDialog
        open={isAddAppointmentOpen}
        onOpenChange={setIsAddAppointmentOpen}
        onAddAppointment={handleAddAppointment}
      />
      <CreateInvoiceDialog
        open={isCreateInvoiceOpen}
        onOpenChange={setIsCreateInvoiceOpen}
        onAdd={handleAddInvoice}
      />
    </div>
  )
}
