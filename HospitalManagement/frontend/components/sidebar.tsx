"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/types"
import { Icons } from "@/components/ui/icons"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  userRole: UserRole
}

export function Sidebar({ className, userRole, ...props }: SidebarProps) {
  const pathname = usePathname()

  const adminNavItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: Icons.layoutDashboard,
    },
    {
      title: "Patients",
      href: "/admin/patients",
      icon: Icons.users,
    },
    {
      title: "Doctors",
      href: "/admin/doctors",
      icon: Icons.stethoscope,
    },
    {
      title: "Appointments",
      href: "/admin/appointments",
      icon: Icons.calendar,
    },
    {
      title: "Staff",
      href: "/admin/staff",
      icon: Icons.userCog,
    },
    {
      title: "Departments",
      href: "/admin/departments",
      icon: Icons.layoutDashboard,
    },
    {
      title: "Medical Records",
      href: "/admin/records",
      icon: Icons.fileText,
    },

    {
      title: "Billing",
      href: "/admin/billing",
      icon: Icons.creditCard,
    },
    /* {
      title: "Insurance",
      href: "/admin/insurance",
      icon: Icons.shieldCheck,
    }, */
    {
      title: "Scheduling",
      href: "/admin/schedule",
      icon: Icons.calendarDays,
    },
    /* {
      title: "Visitor Log",
      href: "/admin/visitors",
      icon: Icons.eye,
    }, */
    /* {
      title: "Messages",
      href: "/admin/messages",
      icon: Icons.messageSquare,
    }, */
    /* {
      title: "Check-in",
      href: "/admin/check-in",
      icon: Icons.clipboardCheck,
    }, */
    {
      title: "Reports",
      href: "/admin/reports",
      icon: Icons.activity,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Icons.settings,
    },
  ]

  const doctorNavItems = [
    {
      title: "Dashboard",
      href: "/doctor/dashboard",
      icon: Icons.layoutDashboard,
    },
    {
      title: "My Schedule",
      href: "/doctor/schedule",
      icon: Icons.calendar,
    },
    {
      title: "Patients",
      href: "/doctor/patients",
      icon: Icons.users,
    },
    {
      title: "Appointments",
      href: "/doctor/appointments",
      icon: Icons.calendarCheck,
    },
    {
      title: "Medical Records",
      href: "/doctor/medical-records",
      icon: Icons.fileText,
    },
    {
      title: "Prescriptions",
      href: "/doctor/prescriptions",
      icon: Icons.pill,
    },
    {
      title: "Lab Tests",
      href: "/doctor/lab-tests",
      icon: Icons.microscope,
    },

  ]

  const patientNavItems = [
    {
      title: "Dashboard",
      href: "/patient/dashboard",
      icon: Icons.layoutDashboard,
    },
    {
      title: "My Appointments",
      href: "/patient/appointments",
      icon: Icons.calendar,
    },
    {
      title: "Medical Records",
      href: "/patient/medical-records",
      icon: Icons.fileText,
    },
    {
      title: "Prescriptions",
      href: "/patient/prescriptions",
      icon: Icons.pill,
    },
    {
      title: "Lab Results",
      href: "/patient/lab-results",
      icon: Icons.microscope,
    },
    {
      title: "Billing",
      href: "/patient/billing",
      icon: Icons.creditCard,
    },
    {
      title: "Profile",
      href: "/patient/profile",
      icon: Icons.user,
    },
  ]

  const receptionistNavItems = [
    {
      title: "Dashboard",
      href: "/receptionist/dashboard",
      icon: Icons.layoutDashboard,
    },
    {
      title: "Appointments",
      href: "/receptionist/appointments",
      icon: Icons.calendar,
    },
    {
      title: "Patients",
      href: "/receptionist/patients",
      icon: Icons.users,
    },
    /* {
      title: "Check-in",
      href: "/receptionist/check-in",
      icon: Icons.clipboardCheck,
    }, */
    {
      title: "Billing",
      href: "/receptionist/billing",
      icon: Icons.creditCard,
    },
    {
      title: "Doctor Schedule",
      href: "/receptionist/schedule",
      icon: Icons.calendar,
    },
    /*     {
          title: "Insurance",
          href: "/receptionist/insurance",
          icon: Icons.shieldCheck,
        }, */
    {
      title: "Daily Reports",
      href: "/receptionist/reports",
      icon: Icons.activity,
    },
    /* {
      title: "Visitor Log",
      href: "/receptionist/visitors",
      icon: Icons.eye,
    }, */
    /*     {
          title: "Messages",
          href: "/receptionist/messages",
          icon: Icons.messageSquare,
        }, */
    {
      title: "Settings",
      href: "/receptionist/settings",
      icon: Icons.settings,
    },
  ]

  const getNavItems = () => {
    switch (userRole) {
      case 'admin':
        return adminNavItems
      case 'doctor':
        return doctorNavItems
      case 'patient':
        return patientNavItems
      case 'receptionist':
        return receptionistNavItems
      default:
        return []
    }
  }

  const navItems = getNavItems()

  return (
    <div className={cn("hidden border-r bg-muted/40 md:block w-64", className)} {...props}>
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.stethoscope className={cn("h-6 w-6", userRole === 'admin' ? "text-emerald-500" : "text-red-500")} />
            <span className="font-bold text-lg uppercase tracking-tighter">
              {userRole === 'admin' ? "Master Control" : "Hospital System"}
            </span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all group/nav",
                  pathname === item.href
                    ? userRole === 'admin'
                      ? "bg-emerald-500/10 text-emerald-600 border-l-4 border-emerald-500 rounded-l-none font-bold"
                      : "bg-muted text-primary"
                    : userRole === 'admin'
                      ? "hover:text-emerald-500 hover:bg-emerald-50"
                      : "hover:text-primary"
                )}
              >
                <item.icon className={cn(
                  "h-4 w-4 transition-colors",
                  pathname === item.href
                    ? userRole === 'admin' ? "text-emerald-500" : "text-primary"
                    : "text-muted-foreground group-hover/nav:text-emerald-500"
                )} />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
