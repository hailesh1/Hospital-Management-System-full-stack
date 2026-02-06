package com.hospital.management.repository;

import com.hospital.management.entity.LabTest;
import com.hospital.management.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabTestRepository extends JpaRepository<LabTest, String> {
    
    List<LabTest> findByPatient(Patient patient);
    
    List<LabTest> findByStatus(LabTest.TestStatus status);
    
    List<LabTest> findByPatientNameContainingIgnoreCaseOrTestNameContainingIgnoreCase(
            String patientName, String testName);
}



