package com.hospital.management.repository;

import com.hospital.management.entity.Appointment;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, String> {
    
    List<Appointment> findByPatient(Patient patient);
    
    List<Appointment> findByDoctor(Staff doctor);
    
    List<Appointment> findByDate(LocalDate date);
    
    List<Appointment> findByStatus(Appointment.AppointmentStatus status);
    
    List<Appointment> findByDateAndStatus(LocalDate date, Appointment.AppointmentStatus status);
}



