package com.hospital.management.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "medical_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(nullable = false)
    private String patientName;

    @Column(nullable = false)
    private LocalDate date = LocalDate.now();

    @Column(nullable = false, columnDefinition = "TEXT")
    private String diagnosis;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String treatment;

    @ElementCollection
    @CollectionTable(name = "medical_record_prescriptions", joinColumns = @JoinColumn(name = "medical_record_id"))
    @Column(name = "prescription")
    private List<String> prescriptions = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Staff doctor;

    @Column(nullable = false)
    private String doctorName;

    @OneToMany(mappedBy = "medicalRecord", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MedicalRecordFile> files = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();
}



