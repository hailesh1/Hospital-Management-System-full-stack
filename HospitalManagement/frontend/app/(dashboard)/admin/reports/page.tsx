"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Badge } from "@/components/ui/badge"

export default function AdminReportsPage() {
    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl border border-emerald-50">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white flex items-center">
                        Financial & Ops <span className="ml-3 px-3 py-1 bg-emerald-500 text-white text-xs rounded-full uppercase tracking-tighter">Daily Reports</span>
                    </h1>
                    <p className="text-lg font-medium text-muted-foreground mt-2">
                        Generating <span className="text-emerald-600 font-bold">comprehensive reports</span> for hospital stakeholders.
                    </p>
                </div>
                <Button
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
                    className="bg-emerald-600 text-white h-14 px-8 rounded-2xl font-black shadow-xl"
                >
                    <Icons.fileDown className="mr-3 h-5 w-5" /> Generate Full System Audit
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {['Financial Summary', 'Staff Performance', 'Patient Demographics', 'Inventory Status', 'Departmental Load', 'Security Logs'].map(report => (
                    <Card key={report} className="border-none shadow-lg hover:shadow-2xl transition-all cursor-pointer group bg-white border border-emerald-50">
                        <CardHeader className="bg-emerald-50 p-6 group-hover:bg-emerald-600 transition-colors">
                            <div className="flex items-center justify-between">
                                <Icons.fileText className="h-8 w-8 text-emerald-600 group-hover:text-white" />
                                <Badge className="bg-emerald-100 text-emerald-700 group-hover:bg-white/20 group-hover:text-white">PDF / CSV</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-black group-hover:text-emerald-700 transition-colors">{report}</h3>
                            <p className="text-sm text-muted-foreground mt-2">Automated report generated at the end of each business day.</p>
                            <Button
                                variant="ghost"
                                className="w-full mt-6 border border-emerald-100 group-hover:bg-emerald-50 font-black text-emerald-600"
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    try {
                                        const res = await fetch('/api/reports/system-audit');
                                        const data = await res.json();
                                        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                                        const url = window.URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `${report.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
                                        document.body.appendChild(a);
                                        a.click();
                                        window.URL.revokeObjectURL(url);
                                    } catch (error) {
                                        console.error("Failed to generate report:", error);
                                    }
                                }}
                            >
                                Download Report
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
