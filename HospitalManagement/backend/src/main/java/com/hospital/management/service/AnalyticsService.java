package com.hospital.management.service;

import com.hospital.management.entity.*;
import com.hospital.management.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final StaffRepository staffRepository;
    private final InvoiceRepository invoiceRepository;
    private final LabTestRepository labTestRepository;
    private final PrescriptionRepository prescriptionRepository;

    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalPatients = patientRepository.count();
        long activePatients = patientRepository.findByStatus(Patient.PatientStatus.ACTIVE).size();
        
        long totalAppointments = appointmentRepository.count();
        long todayAppointments = appointmentRepository.findByDate(LocalDate.now()).size();
        long scheduledAppointments = appointmentRepository.findByStatus(Appointment.AppointmentStatus.SCHEDULED).size();
        long completedAppointments = appointmentRepository.findByStatus(Appointment.AppointmentStatus.COMPLETED).size();

        long totalStaff = staffRepository.count();
        long activeStaff = staffRepository.findByStatus(Staff.StaffStatus.ACTIVE).size();

        double totalRevenue = invoiceRepository.findByStatus(Invoice.InvoiceStatus.PAID).stream()
                .mapToDouble(Invoice::getTotal)
                .sum();

        double pendingRevenue = invoiceRepository.findByStatus(Invoice.InvoiceStatus.PENDING).stream()
                .mapToDouble(Invoice::getTotal)
                .sum();

        long pendingLabTests = labTestRepository.findByStatus(LabTest.TestStatus.ORDERED).size();
        long activePrescriptions = prescriptionRepository.findByStatus(Prescription.PrescriptionStatus.ACTIVE).size();

        stats.put("totalPatients", totalPatients);
        stats.put("activePatients", activePatients);
        stats.put("totalAppointments", totalAppointments);
        stats.put("todayAppointments", todayAppointments);
        stats.put("scheduledAppointments", scheduledAppointments);
        stats.put("completedAppointments", completedAppointments);
        stats.put("totalStaff", totalStaff);
        stats.put("activeStaff", activeStaff);
        stats.put("totalRevenue", totalRevenue);
        stats.put("pendingRevenue", pendingRevenue);
        stats.put("pendingLabTests", pendingLabTests);
        stats.put("activePrescriptions", activePrescriptions);

        return stats;
    }
}



