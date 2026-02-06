import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"

const appointments = [
  {
    id: "1",
    patient: "Jara tesema",
    doctor: "DR Hiwot Ketma",
    time: "09:00 AM",
    type: "Checkup",
    status: "confirmed",
  },
  {
    id: "2",
    patient: "Akelilu Besufekad",
    doctor: "DR Alemu Belay",
    time: "10:30 AM",
    type: "Follow-up",
    status: "scheduled",
  },
  {
    id: "3",
    patient: "Yetenayet Bilew",
    doctor: "DR Marekan Haset",
    time: "02:00 PM",
    type: "Consultation",
    status: "confirmed",
  },
  {
    id: "4",
    patient: "Yalem Ademas",
    doctor: "DR Rakeb Taye",
    time: "03:30 PM",
    type: "Emergency",
    status: "scheduled",
  },
]

const statusColors = {
  confirmed: "bg-green-500/10 text-green-700 dark:text-green-400",
  scheduled: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  completed: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
  cancelled: "bg-red-500/10 text-red-700 dark:text-red-400",
}

export function RecentAppointments() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Today's Appointments</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {appointment.patient
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{appointment.patient}</p>
                <p className="text-sm text-muted-foreground">{appointment.doctor}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {appointment.time}
              </div>
              <Badge variant="secondary" className={statusColors[appointment.status as keyof typeof statusColors]}>
                {appointment.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
