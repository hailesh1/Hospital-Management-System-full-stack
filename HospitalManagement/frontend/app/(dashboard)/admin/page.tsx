"use client"

import { useEffect, useState } from "react"
import { DashboardCard } from "@/components/dashboard-card"
import { Icons } from "@/components/ui/icons"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from "recharts"

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        patients: 0,
        doctors: 0,
        appointments: 0,
        revenue: 0,
        records: 0,
        labTests: 0,
        billing: 0,
        staff: 0,
    })

    const [recentActivity, setRecentActivity] = useState<any[]>([])
    const [analyticsData, setAnalyticsData] = useState<any>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsRes = await fetch('/api/dashboard/stats')
                const dashboardStats = await statsRes.json()

                setStats({
                    patients: dashboardStats.patients || 0,
                    doctors: dashboardStats.doctors || 0,
                    appointments: dashboardStats.appointmentsToday || 0,
                    revenue: dashboardStats.revenue || 0,
                    records: dashboardStats.medicalRecords || 0,
                    labTests: dashboardStats.labTests || 0,
                    billing: dashboardStats.billing || 0,
                    staff: dashboardStats.staff || 0,
                })

                const recentRes = await fetch('/api/dashboard/recent-patients')
                if (recentRes.ok) {
                    const recentData = await recentRes.json()
                    setRecentActivity(recentData)
                }

                const analyticsRes = await fetch('/api/dashboard/analytics')
                if (analyticsRes.ok) {
                    const analyticsData = await analyticsRes.json()
                    setAnalyticsData(analyticsData)
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error)
            }
        }

        fetchData()
    }, [])

    const COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl shadow-emerald-900/5 border border-emerald-50 dark:border-emerald-900/20">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white flex items-center">
                        Master System Hierarchy <span className="ml-3 px-3 py-1 bg-emerald-600 text-white text-xs rounded-full uppercase tracking-tighter animate-pulse">Root Access</span>
                    </h1>
                    <p className="text-lg font-medium text-muted-foreground mt-2">
                        Complete high-level control and <span className="text-emerald-600 font-bold">top-tier system analysis</span>.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard
                    title="Total Patients"
                    value={stats.patients}
                    description="Active hospital records"
                    icon="users"
                    trend={{ value: "+12%", isPositive: true }}
                    href="/admin/patients"
                />
                <DashboardCard
                    title="Specialists"
                    value={stats.doctors}
                    description="Qualified doctors"
                    icon="stethoscope"
                    trend={{ value: "+2", isPositive: true }}
                    href="/admin/doctors"
                />
                <DashboardCard
                    title="Today's Appointments"
                    value={stats.appointments}
                    description="Scheduled visits"
                    icon="hospital"
                    trend={{ value: "-5%", isPositive: false }}
                    className="hover:bg-red-600 hover:border-red-600 hover:shadow-red-500/40"
                    href="/admin/appointments"
                />
                <DashboardCard
                    title="Revenue (Month)"
                    value={`ETB ${stats.revenue.toLocaleString()}`}
                    description="Total collections"
                    icon="billing"
                    trend={{ value: "+24%", isPositive: true }}
                    className="hover:bg-blue-600 hover:border-blue-600 hover:shadow-blue-500/40 font-mono"
                    href="/admin/billing"
                />
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white dark:bg-gray-950 p-8 rounded-3xl shadow-xl border border-emerald-50/50 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-black tracking-tight flex items-center">
                                    Patient Traffic <Icons.flame className="ml-2 h-5 w-5 text-orange-500" />
                                </h3>
                                <p className="text-sm font-bold text-muted-foreground mt-1 uppercase tracking-widest">7-Day Appointment Trend</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
                                <span className="h-3 w-3 rounded-full bg-red-500"></span>
                                <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                            </div>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analyticsData?.appointments || []}>
                                    <defs>
                                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ fontWeight: '900', color: '#064e3b' }}
                                    />
                                    <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorVisits)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-950 p-8 rounded-3xl shadow-xl border border-emerald-50/50 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
                        <h3 className="text-2xl font-black mb-8 px-4 flex items-center">
                            Revenue Analysis <Icons.creditCard className="ml-2 h-5 w-5 text-blue-500" />
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analyticsData?.revenue || []}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white dark:bg-gray-950 p-8 rounded-3xl shadow-xl border border-emerald-50/50">
                        <h3 className="text-xl font-black mb-8 flex items-center uppercase tracking-widest text-emerald-900">
                            Dept Workload <Icons.activity className="ml-2 h-5 w-5 text-emerald-500" />
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={analyticsData?.departments || []}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="count"
                                    >
                                        {(analyticsData?.departments || []).map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-3">
                            {(analyticsData?.departments || []).map((dept: any, i: number) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                        <span className="text-sm font-bold opacity-70">{dept.name}</span>
                                    </div>
                                    <span className="text-sm font-black">{dept.count} cases</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-emerald-600 text-white rounded-3xl shadow-2xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -m-8 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
                        <h4 className="text-lg font-black uppercase tracking-widest mb-4">Quick Audit</h4>
                        <p className="text-emerald-50 font-medium mb-6">Review system-wide activities and export for stakeholders.</p>
                        <button
                            onClick={async () => {
                                try {
                                    const res = await fetch('/api/reports/system-audit');
                                    const data = await res.json();
                                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                                    const url = window.URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `system-audit-${new Date().toISOString().split('T')[0]}.json`;
                                    document.body.appendChild(a);
                                    a.click();
                                    window.URL.revokeObjectURL(url);
                                } catch (error) {
                                    console.error("Failed to generate report:", error);
                                }
                            }}
                            className="w-full py-4 bg-white text-emerald-600 font-black rounded-2xl hover:bg-emerald-50 transition-colors shadow-lg shadow-emerald-900/40"
                        >
                            Generate Full Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
