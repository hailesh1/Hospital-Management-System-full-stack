package com.hospital.management.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "vital_signs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VitalSigns {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    private Double weight; // in kg
    private Double height; // in cm
    private String bloodPressure; // e.g., "120/80"
    private Double temperature; // in Celsius
    private Integer pulse; // beats per minute
    private Integer respiratoryRate;

    @Builder.Default
    private LocalDateTime recordedAt = LocalDateTime.now();
}
