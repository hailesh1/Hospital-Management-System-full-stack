package com.hospital.management.repository;

import com.hospital.management.entity.Invoice;
import com.hospital.management.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, String> {
    
    List<Invoice> findByPatient(Patient patient);
    
    List<Invoice> findByStatus(Invoice.InvoiceStatus status);
    
    List<Invoice> findByPatientNameContainingIgnoreCaseOrIdContaining(String patientName, String id);
}



