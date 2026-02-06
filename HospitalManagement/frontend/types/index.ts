export type UserRole = "admin" | "doctor" | "patient" | "receptionist"

export interface Patient {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: "male" | "female" | "other"
  bloodType?: string
  address?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  registeredDate: string
  status: "active" | "inactive"
}

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  date: string
  time: string
  type: "checkup" | "follow-up" | "emergency" | "consultation"
  status: "scheduled" | "confirmed" | "completed" | "cancelled"
  notes?: string
}

export interface MedicalRecord {
  id: string
  patientId: string
  patientName: string
  date: string
  diagnosis: string
  treatment: string
  prescriptions?: string[]
  doctorId: string
  doctorName: string
  files?: {
    id: string
    name: string
    type: string
    url: string
  }[]
}

export interface Staff {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: "doctor" | "nurse" | "admin" | "receptionist"
  specialization?: string
  department?: string
  joinDate: string
  status: "active" | "inactive"
}

export interface Invoice {
  id: string
  patientId: string
  patientName: string
  date: string
  dueDate: string
  items: {
    description: string
    quantity: number
    unitPrice: number
    total: number
  }[]
  subtotal: number
  tax: number
  total: number
  status: "paid" | "pending" | "overdue" | "cancelled"
  paymentMethod?: string
  paidDate?: string
}

export interface LabTest {
  id: string
  patientId: string
  patientName: string
  testName: string
  testType: "blood" | "urine" | "xray" | "mri" | "ct-scan" | "ultrasound" | "other"
  orderedBy: string
  orderedDate: string
  sampleCollectedDate?: string
  resultDate?: string
  status: "ordered" | "sample-collected" | "in-progress" | "completed" | "cancelled"
  results?: string
  normalRange?: string
  notes?: string
}

export interface Prescription {
  id: string
  patientId: string
  patientName: string
  medicationName: string
  dosage: string
  frequency: string
  duration: string
  prescribedBy: string
  prescribedDate: string
  status: "active" | "completed" | "discontinued"
  notes?: string
  refillsRemaining?: number
}

export interface StaffSchedule {
  id: string
  staffId: string
  staffName: string
  date: string
  shiftType: "morning" | "afternoon" | "night"
  startTime: string
  endTime: string
  department: string
  status: "scheduled" | "completed" | "absent" | "on-leave"
}

export interface Attendance {
  id: string
  staffId: string
  staffName: string
  date: string
  checkIn?: string
  checkOut?: string
  status: "present" | "absent" | "late" | "half-day" | "on-leave"
  notes?: string
}
