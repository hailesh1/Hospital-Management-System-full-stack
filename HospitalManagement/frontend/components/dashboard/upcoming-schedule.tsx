import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

const schedule = [
  { time: "09:00 AM", event: "Morning Rounds", type: "routine" },
  { time: "11:00 AM", event: "Staff Meeting", type: "meeting" },
  { time: "02:00 PM", event: "Surgery - Room 3", type: "surgery" },
  { time: "04:00 PM", event: "Patient Consultations", type: "consultation" },
]

const typeColors = {
  routine: "bg-blue-500",
  meeting: "bg-purple-500",
  surgery: "bg-red-500",
  consultation: "bg-green-500",
}

export function UpcomingSchedule() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Schedule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {schedule.map((item, index) => (
          <div key={index} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`h-2 w-2 rounded-full ${typeColors[item.type as keyof typeof typeColors]}`} />
              {index !== schedule.length - 1 && <div className="flex-1 w-px bg-border mt-1" />}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Clock className="h-3 w-3" />
                {item.time}
              </div>
              <p className="font-medium text-foreground">{item.event}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
