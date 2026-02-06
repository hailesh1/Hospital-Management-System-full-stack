package com.hospital.management.dto.response;

import com.hospital.management.entity.Prescription;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class PrescriptionResponse {
    private String id;
    private String patientId;
    private String patientName;
    private String medicationName;
    private String dosage;
    private String frequency;
    private String duration;
    private String prescribedBy;
    private LocalDate prescribedDate;
    private Prescription.PrescriptionStatus status;
    private String notes;
    private Integer refillsRemaining;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}



