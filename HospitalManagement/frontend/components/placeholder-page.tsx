import { DashboardCard } from "@/components/dashboard-card"

export default function PlaceholderPage({ title, description }: { title: string, description: string }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{title}</h1>
                    <p className="text-muted-foreground">
                        {description}
                    </p>
                </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8 text-center">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="p-4 rounded-full bg-muted">
                        {/* Icon placeholder */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-construction"><rect x="2" y="6" width="20" height="8" rx="1" /><path d="M17 14v7" /><path d="M7 14v7" /><path d="M17 3v3" /><path d="M7 3v3" /><path d="M10 14 2.3 6.3" /><path d="m14 6 7.7 7.7" /><path d="m8 6 8 8" /></svg>
                    </div>
                    <h2 className="text-xl font-semibold">Under Construction</h2>
                    <p className="text-muted-foreground max-w-md">
                        The {title} feature is currently being implemented. Check back soon for updates.
                    </p>
                </div>
            </div>
        </div>
    )
}
