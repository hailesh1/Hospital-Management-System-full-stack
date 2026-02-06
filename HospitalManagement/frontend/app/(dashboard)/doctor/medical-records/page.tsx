"use client"

import { useEffect, useState } from "react"
import { MedicalRecordsTable } from "@/components/records/medical-records-table"
import { UploadRecordDialog } from "@/components/records/upload-record-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function DoctorMedicalRecordsPage() {
  const { user } = useAuth()
  const [records, setRecords] = useState([])
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await fetch('/api/medical-records');
        if (res.ok) {
          const data = await res.json();
          setRecords(data);
        } else {
          console.error("Failed to fetch records");
        }
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };
    fetchRecords();
  }, [])

  const handleRecordUploaded = async (newRecord: any) => {
    try {
      const res = await fetch('/api/medical-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: newRecord.patientId,
          title: newRecord.title,
          type: newRecord.type,
          description: newRecord.description,
          fileName: newRecord.fileName,
          doctorId: user?.id,
          doctorName: user?.name
        }),
      });

      if (res.ok) {
        const savedRecord = await res.json();
        setRecords((prev) => [savedRecord, ...prev]);
        setIsUploadOpen(false);
      } else {
        const errorData = await res.json();
        console.error("Failed to save record:", errorData.error);
        alert(`Failed to save record: ${errorData.details || errorData.error}`);
      }
    } catch (error) {
      console.error("Error saving record:", error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Medical Records</h1>
          <p className="text-muted-foreground">
            Access patient records and upload reports.
          </p>
        </div>
        <Button onClick={() => setIsUploadOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Upload Record
        </Button>
      </div>

      <MedicalRecordsTable newRecords={records} />

      <UploadRecordDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        onUploadRecord={handleRecordUploaded}
      />
    </div>
  )
}
