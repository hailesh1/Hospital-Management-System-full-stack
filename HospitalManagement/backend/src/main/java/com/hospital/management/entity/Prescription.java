package com.hospital.management.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "prescriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(nullable = false)
    private String patientName;

    @Column(nullable = false)
    private String medicationName;

    @Column(nullable = false)
    private String dosage;

    @Column(nullable = false)
    private String frequency;

    @Column(nullable = false)
    private String duration;

    @Column(nullable = false)
    private String prescribedBy;

    @Column(nullable = false)
    private LocalDate prescribedDate = LocalDate.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PrescriptionStatus status = PrescriptionStatus.ACTIVE;

    private String notes;

    private Integer refillsRemaining;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum PrescriptionStatus {
        ACTIVE, COMPLETED, DISCONTINUED;

        @com.fasterxml.jackson.annotation.JsonCreator
        public static PrescriptionStatus fromString(String value) {
            if (value == null) return null;
            return PrescriptionStatus.valueOf(value.toUpperCase());
        }
    }
}



