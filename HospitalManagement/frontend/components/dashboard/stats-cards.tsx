import { Card, CardContent } from "@/components/ui/card"
import { Users, Calendar, FileText, TrendingUp } from "lucide-react"



interface StatsCardsProps {
  stats?: {
    patients: number
    appointmentsToday: number
    medicalRecords: number
    activeStaff: number
  }
}

export function StatsCards({ stats: inputStats }: StatsCardsProps) {
  const statsData = [
    {
      title: "Total Patients",
      value: (inputStats?.patients || 0).toLocaleString(),
      change: "+12.5%", // Placeholder for trend
      trend: "up",
      icon: Users,
    },
    {
      title: "Today's Appointments",
      value: (inputStats?.appointmentsToday || 0).toString(),
      change: "6 pending", // Placeholder
      trend: "neutral",
      icon: Calendar,
    },
    {
      title: "Medical Records",
      value: (inputStats?.medicalRecords || 0).toLocaleString(),
      change: "+8.2%", // Placeholder
      trend: "up",
      icon: FileText,
    },
    {
      title: "Active Staff",
      value: (inputStats?.activeStaff || 0).toString(),
      change: "98% attendance", // Placeholder
      trend: "up",
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat) => (
        <Card key={stat.title} className="transition-all duration-500 hover:shadow-2xl hover:scale-[1.05] cursor-pointer hover:border-green-600 hover:bg-green-600 group border-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 -m-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-700" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-black uppercase tracking-widest text-muted-foreground group-hover:text-white transition-colors duration-300">{stat.title}</p>
                <p className="text-2xl font-black text-foreground group-hover:text-white transition-colors duration-300">{stat.value}</p>
                <p className="text-xs font-bold text-muted-foreground group-hover:text-green-100 transition-colors duration-300">{stat.change}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-white transition-all duration-500">
                <stat.icon className="h-5 w-5 text-green-600 transition-all group-hover:scale-125" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
