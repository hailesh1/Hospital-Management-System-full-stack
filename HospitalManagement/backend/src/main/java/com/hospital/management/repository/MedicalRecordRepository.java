package com.hospital.management.repository;

import com.hospital.management.entity.MedicalRecord;
import com.hospital.management.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, String> {
    
    List<MedicalRecord> findByPatient(Patient patient);
    
    List<MedicalRecord> findByPatientNameContainingIgnoreCase(String patientName);
}



