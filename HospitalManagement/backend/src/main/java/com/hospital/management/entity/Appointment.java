package com.hospital.management.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(nullable = false)
    private String patientName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Staff doctor;

    @Column(nullable = false)
    private String doctorName;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private String time;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status = AppointmentStatus.SCHEDULED;

    private String notes;

    private LocalDateTime checkedInAt;

    private LocalDateTime completedAt;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    private String createdBy;

    public enum AppointmentType {
        CHECKUP, FOLLOW_UP, EMERGENCY, CONSULTATION;

        @com.fasterxml.jackson.annotation.JsonCreator
        public static AppointmentType fromString(String value) {
            if (value == null)
                return null;
            return AppointmentType.valueOf(value.toUpperCase());
        }
    }

    public enum AppointmentStatus {
        SCHEDULED, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED;

        @com.fasterxml.jackson.annotation.JsonCreator
        public static AppointmentStatus fromString(String value) {
            if (value == null)
                return null;
            return AppointmentStatus.valueOf(value.toUpperCase());
        }
    }
}
