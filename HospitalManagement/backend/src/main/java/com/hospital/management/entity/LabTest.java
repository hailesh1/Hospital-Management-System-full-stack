package com.hospital.management.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "lab_tests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LabTest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(nullable = false)
    private String patientName;

    @Column(nullable = false)
    private String testName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TestType testType;

    @Column(nullable = false)
    private String orderedBy;

    @Column(nullable = false)
    private LocalDate orderedDate = LocalDate.now();

    private LocalDate sampleCollectedDate;

    private LocalDate resultDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TestStatus status = TestStatus.ORDERED;

    private String results;

    private String normalRange;

    private String notes;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum TestType {
        BLOOD, URINE, XRAY, MRI, CT_SCAN, ULTRASOUND, OTHER;

        @com.fasterxml.jackson.annotation.JsonCreator
        public static TestType fromString(String value) {
            if (value == null) return null;
            return TestType.valueOf(value.toUpperCase());
        }
    }

    public enum TestStatus {
        ORDERED, SAMPLE_COLLECTED, IN_PROGRESS, COMPLETED, CANCELLED;

        @com.fasterxml.jackson.annotation.JsonCreator
        public static TestStatus fromString(String value) {
            if (value == null) return null;
            return TestStatus.valueOf(value.toUpperCase());
        }
    }
}



