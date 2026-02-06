import Link from "next/link"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/ui/icons"

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  className?: string
}

export function MainNav({ className, ...props }: MainNavProps) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        <Icons.home className="h-5 w-5" />
      </Link>
      <Link
        href="/appointments"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Appointments
      </Link>
      <Link
        href="/doctors"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Find a Doctor
      </Link>
      <Link
        href="/services"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Services
      </Link>
      <Link
        href="/contact"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Contact
      </Link>
    </nav>
  )
}
