import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Pill, Activity, AlertCircle, ClipboardList, Printer, Download } from "lucide-react"
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { toast } from "sonner"

interface MedicalHistoryDialogProps {
  patientName: string
  patientId: string
}

export function MedicalHistoryDialog({ patientName, patientId }: MedicalHistoryDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [medicalHistory, setMedicalHistory] = useState({
    visits: [],
    prescriptions: [],
    allergies: ['No known allergies'],
    chronicConditions: ['None reported'],
    vaccinations: [],
  })

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      if (!patientId) return

      setLoading(true)
      try {
        const response = await fetch(`/api/patients/${patientId}/medical-history`)
        if (response.ok) {
          const data = await response.json()
          setMedicalHistory(data)
        } else {
          const errorData = await response.json().catch(() => ({}))
          console.error('Failed to fetch medical history:', response.status, errorData)
        }
      } catch (error) {
        console.error('Error fetching medical history:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMedicalHistory()
  }, [patientId])

  const handlePrint = () => {
    window.print()
  }

  const handleExportPDF = async () => {
    if (!contentRef.current) {
      toast.error("Export failed: Content reference is missing")
      return
    }

    setIsExporting(true)
    const toastId = toast.loading("Generating medical history report...")

    try {
      const element = contentRef.current

      // Using scale 2 for better resolution
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`Medical_History_${(patientName || "Patient").replace(/\s+/g, '_')}.pdf`)

      toast.success("Medical History PDF generated successfully", { id: toastId })
    } catch (error) {
      console.error("Failed to export PDF:", error)
      toast.error("Failed to generate PDF. Please check the console for details.", { id: toastId })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>View Medical History</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Medical History - {patientName}</DialogTitle>
          <DialogDescription>Patient ID: {patientId}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[70vh] pr-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading medical history...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6" ref={contentRef} id="printable-content">
              {/* Header for ID in print/pdf */}
              <div className="hidden print:block mb-6">
                <h1 className="text-2xl font-bold">Medical History Report</h1>
                <p>Patient: {patientName}</p>
                <p>ID: {patientId}</p>
                <p>Generated: {new Date().toLocaleDateString()}</p>
              </div>

              {/* Allergies Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <h3 className="text-lg font-semibold text-foreground">Allergies</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {medicalHistory.allergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive" className="text-sm">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Chronic Conditions */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Chronic Conditions</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {medicalHistory.chronicConditions.map((condition, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Visit History */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Visit History</h3>
                </div>
                <div className="space-y-3">
                  {medicalHistory.visits.map((visit) => (
                    <div key={visit.id} className="border border-border rounded-lg p-4 space-y-2 break-inside-avoid">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-foreground">{visit.type}</p>
                          <p className="text-sm text-muted-foreground">{visit.date}</p>
                        </div>
                        <Badge variant="outline">{visit.doctor}</Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="font-medium text-foreground">Diagnosis:</span>{" "}
                          <span className="text-muted-foreground">{visit.diagnosis}</span>
                        </p>
                        <p className="text-sm">
                          <span className="font-medium text-foreground">Notes:</span>{" "}
                          <span className="text-muted-foreground">{visit.notes}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prescriptions */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Prescription History</h3>
                </div>
                <div className="space-y-3">
                  {medicalHistory.prescriptions.map((prescription) => (
                    <div key={prescription.id} className="border border-border rounded-lg p-4 space-y-2 break-inside-avoid">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-foreground">{prescription.medication}</p>
                          <p className="text-sm text-muted-foreground">{prescription.date}</p>
                        </div>
                        <Badge variant="outline">{prescription.prescribedBy}</Badge>
                      </div>
                      <p className="text-sm">
                        <span className="font-medium text-foreground">Dosage:</span>{" "}
                        <span className="text-muted-foreground">{prescription.dosage}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vaccinations */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Vaccination Records</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {medicalHistory.vaccinations.map((vaccine, index) => (
                    <div key={index} className="border border-border rounded-lg p-3 break-inside-avoid">
                      <p className="font-medium text-foreground">{vaccine.name}</p>
                      <p className="text-sm text-muted-foreground">{vaccine.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Print History
          </Button>
          <Button onClick={handleExportPDF} disabled={isExporting} className="gap-2">
            {isExporting ? (
              <>Generating...</>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export to PDF
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
