package com.hospital.management.repository;

import com.hospital.management.entity.VitalSigns;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VitalSignsRepository extends JpaRepository<VitalSigns, String> {
    
    List<VitalSigns> findByPatient(Patient patient);
    
    Optional<VitalSigns> findByAppointment(Appointment appointment);
    
    List<VitalSigns> findByPatientOrderByRecordedAtDesc(Patient patient);
}
