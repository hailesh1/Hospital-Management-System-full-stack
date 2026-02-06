"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"

export default function PatientDashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    medicalRecords: 0,
    prescriptions: 0,
    messages: 0,
    nextAppointment: null
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Use user ID from auth context if available
        const id = user?.id || '';
        const res = await fetch(`/api/patient/stats${id ? `?patientId=${id}` : ''}`);
        if (res.ok) {
          const data = await res.json();
          // Ensure we don't overwrite stats with an error object
          if (data && !data.error) {
            setStats(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch patient stats", error);
      }
    };
    fetchStats();
  }, [user]);

  const statCards = [
    {
      title: "Upcoming Appointments",
      value: (stats.upcomingAppointments ?? 0).toString(),
      desc: stats.nextAppointment ? `Next: ${new Date(stats.nextAppointment).toLocaleDateString()}` : "No upcoming visits",
      icon: "calendar",
      href: "/patient/appointments"
    },
    {
      title: "Medical Records",
      value: (stats.medicalRecords ?? 0).toString(),
      desc: "Total records",
      icon: "fileText",
      href: "/patient/medical-records"
    },
    {
      title: "Active Prescriptions",
      value: (stats.prescriptions ?? 0).toString(),
      desc: "View medication plan",
      icon: "pill",
      href: "/patient/prescriptions"
    },
    /*     {
          title: "Unread Messages",
          value: stats.messages.toString(),
          desc: "Recent communications",
          icon: "messageSquare",
          href: "/patient/messages"
        }, */
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900">Welcome back!</h1>
          <p className="text-lg font-medium text-muted-foreground mt-1">
            Your health dashboard is up to date. You have <span className="text-red-600 font-bold">{stats.upcomingAppointments} appointments</span> coming up.
          </p>
        </div>
        <Link href="/patient/appointments">
          <button className="inline-flex items-center justify-center rounded-xl text-base font-black ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 text-white hover:bg-red-700 h-14 px-8 shadow-xl shadow-red-200 hover:scale-105 active:scale-95 group">
            <Icons.plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
            Book New Appointment
          </button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <Link href={stat.href} key={i}>
            <Card className="group cursor-pointer border-none shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 hover:scale-[1.03] border-l-4 border-l-red-600 hover:border-l-emerald-500 bg-gradient-to-br from-white to-red-50/30 overflow-hidden relative h-full">
              <div className="absolute top-0 right-0 -m-4 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity" />
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-red-900/60">{stat.title}</CardTitle>
                <div className="p-2 bg-red-600 rounded-lg shadow-lg shadow-red-100 group-hover:scale-110 transition-transform">
                  {stat.icon === "calendar" && <Icons.calendar className="h-4 w-4 text-white" />}
                  {stat.icon === "fileText" && <Icons.fileText className="h-4 w-4 text-white" />}
                  {stat.icon === "pill" && <Icons.pill className="h-4 w-4 text-white" />}
                  {stat.icon === "messageSquare" && <Icons.messageSquare className="h-4 w-4 text-white" />}
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-black tracking-tight text-gray-900">{stat.value}</div>
                <p className="text-xs font-bold text-red-600 mt-1 uppercase tracking-tighter">{stat.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-none shadow-2xl overflow-hidden bg-white/50 backdrop-blur-xl ring-2 ring-red-50">
          <CardHeader className="bg-red-600 flex flex-row items-center justify-between py-6 px-8 border-b border-red-700">
            <h3 className="text-xl font-black text-white uppercase tracking-widest">Upcoming Visits</h3>
            <Link href="/patient/appointments">
              <button className="text-sm font-black text-white/80 hover:text-white transition-colors border-b border-white/20">View Schedule</button>
            </Link>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {[
              {
                date: 'Tomorrow',
                time: '10:00 AM',
                doctor: 'DR Hiwot Ketma',
                type: 'Follow-up',
                speciality: 'Cardiology'
              },
              {
                date: 'Friday, June 10',
                time: '02:30 PM',
                doctor: 'DR Alemu Belay',
                type: 'Lab Test',
                speciality: 'Pathology'
              },
            ].map((appt, i) => (
              <div key={i} className="flex items-center p-6 border-2 border-red-50 rounded-2xl transition-all duration-300 hover:bg-red-600 hover:border-red-600 hover:shadow-xl group cursor-pointer hover:-translate-y-1">
                <div className="text-center bg-red-50 p-4 rounded-xl mr-6 group-hover:bg-white/20 transition-colors">
                  <div className="text-xs font-black text-red-600 group-hover:text-white uppercase">{appt.date.split(',')[0]}</div>
                  <div className="text-2xl font-black text-red-900 group-hover:text-white leading-none mt-1">{appt.time.split(' ')[0]}</div>
                  <div className="text-[10px] font-black text-red-600/60 group-hover:text-white uppercase leading-none mt-1">{appt.time.split(' ')[1]}</div>
                </div>
                <div className="flex-1">
                  <p className="text-xl font-black text-gray-900 group-hover:text-white transition-colors">{appt.doctor}</p>
                  <p className="text-sm font-bold text-red-600 group-hover:text-red-100 transition-colors uppercase tracking-widest">{appt.speciality}</p>
                  <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-[10px] font-black text-red-700 mt-3 uppercase tracking-tighter group-hover:bg-white group-hover:text-red-600">
                    {appt.type}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {/* <button className="p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all group-hover:bg-white group-hover:text-red-600 shadow-sm">
                    <Icons.messageSquare className="h-5 w-5" />
                  </button> */}
                  <button className="p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all group-hover:bg-white group-hover:text-red-600 shadow-sm">
                    <Icons.moreHorizontal className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-8">
          <Card className="border-none shadow-2xl overflow-hidden ring-2 ring-red-50">
            <CardHeader className="bg-red-600/5 px-8 pt-8 pb-4">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">Quick Access</h3>
            </CardHeader>
            <CardContent className="px-8 pb-8 pt-2">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Find Doctor", icon: <Icons.stethoscope className="h-6 w-6" />, href: "/patient/appointments" },
                  { label: "Med Records", icon: <Icons.fileText className="h-6 w-6" />, href: "/patient/medical-records" },
                  { label: "Prescriptions", icon: <Icons.pill className="h-6 w-6" />, href: "/patient/prescriptions" },
                  { label: "Billing", icon: <Icons.creditCard className="h-6 w-6" />, href: "/patient/billing" },
                ].map((item, i) => (
                  <Link href={item.href} key={i}>
                    <button className="w-full flex flex-col items-center justify-center p-6 rounded-2xl bg-white border-2 border-red-50 transition-all duration-300 hover:bg-red-600 hover:border-red-600 hover:shadow-xl group text-center hover:-translate-y-1">
                      <div className="p-3 bg-red-50 rounded-xl group-hover:bg-white/20 transition-colors text-red-600 group-hover:text-white mb-3">
                        {item.icon}
                      </div>
                      <span className="text-xs font-black text-gray-900 group-hover:text-white transition-colors uppercase tracking-tight">{item.label}</span>
                    </button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-2xl overflow-hidden bg-white ring-2 ring-red-50">
            <CardHeader className="bg-red-600/5 px-8 pt-8 pb-4">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">Health Vitals</h3>
            </CardHeader>
            <CardContent className="px-8 pb-8 pt-2 space-y-6">
              {[
                { label: "Blood Pressure", val: "120/80", color: "bg-red-600", width: "75%" },
                { label: "Heart Rate", val: "72 bpm", color: "bg-red-500", width: "50%" },
                { label: "Body Weight", val: "68 kg", color: "bg-red-400", width: "65%" },
              ].map((vital, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-black text-red-900/60 uppercase tracking-widest leading-none">{vital.label}</span>
                    <span className="text-xl font-black text-gray-900 group-hover:text-red-600 transition-colors leading-none">{vital.val}</span>
                  </div>
                  <div className="h-3 bg-red-50 rounded-full overflow-hidden p-0.5">
                    <div className={`h-full ${vital.color} rounded-full transition-all duration-1000 group-hover:shadow-lg shadow-red-200`} style={{ width: vital.width }}></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
