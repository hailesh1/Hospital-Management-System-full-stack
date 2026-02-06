package com.hospital.management.repository;

import com.hospital.management.entity.Prescription;
import com.hospital.management.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, String> {
    
    List<Prescription> findByPatient(Patient patient);
    
    List<Prescription> findByStatus(Prescription.PrescriptionStatus status);
    
    List<Prescription> findByPatientNameContainingIgnoreCaseOrMedicationNameContainingIgnoreCase(
            String patientName, String medicationName);
}



