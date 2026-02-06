"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import type { LabTest } from "@/types"
import { useState } from "react"
import { LabTestDetailDialog } from "./lab-test-detail-dialog"

interface LabTestsTableProps {
  tests: LabTest[]
  onUpdate: (test: LabTest) => void
}

export function LabTestsTable({ tests, onUpdate }: LabTestsTableProps) {
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null)

  const getStatusColor = (status: LabTest["status"]) => {
    switch (status) {
      case "ordered":
        return "bg-blue-500/10 text-blue-500"
      case "sample-collected":
        return "bg-yellow-500/10 text-yellow-500"
      case "in-progress":
        return "bg-orange-500/10 text-orange-500"
      case "completed":
        return "bg-green-500/10 text-green-500"
      case "cancelled":
        return "bg-gray-500/10 text-gray-500"
    }
  }

  if (tests.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No lab tests found.</div>
  }

  return (
    <>
      <div className="max-h-[500px] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test ID</TableHead>
              <TableHead>Patient Name</TableHead>
              <TableHead>Test Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Ordered Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests.map((test) => (
              <TableRow key={test.id} className="transition-all duration-300 hover:bg-red-600/[0.04] hover:shadow-inner cursor-pointer group">
                <TableCell className="font-bold text-gray-800 group-hover:text-red-800">{test.id}</TableCell>
                <TableCell className="font-semibold">{test.patientName}</TableCell>
                <TableCell className="font-black text-red-600 tracking-tight">{test.testName}</TableCell>
                <TableCell className="capitalize font-medium">{test.testType}</TableCell>
                <TableCell className="font-bold text-gray-700">{new Date(test.orderedDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(test.status)}>{test.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200 shadow-sm" onClick={() => setSelectedTest(test)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedTest && (
        <LabTestDetailDialog
          test={selectedTest}
          open={!!selectedTest}
          onOpenChange={(open) => !open && setSelectedTest(null)}
          onUpdate={onUpdate}
        />
      )}
    </>
  )
}
