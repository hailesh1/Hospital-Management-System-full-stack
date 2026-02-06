package com.hospital.management.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "staff")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StaffRole role;

    private String specialization;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Builder.Default
    @Column(nullable = false)
    private LocalDate joinDate = LocalDate.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StaffStatus status = StaffStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AvailabilityStatus availabilityStatus = AvailabilityStatus.AVAILABLE;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    private String createdBy;

    public enum StaffRole {
        DOCTOR, NURSE, ADMIN, RECEPTIONIST;

        @com.fasterxml.jackson.annotation.JsonCreator
        public static StaffRole fromString(String value) {
            if (value == null)
                return null;
            return StaffRole.valueOf(value.toUpperCase());
        }
    }

    public enum StaffStatus {
        ACTIVE, INACTIVE;

        @com.fasterxml.jackson.annotation.JsonCreator
        public static StaffStatus fromString(String value) {
            if (value == null)
                return null;
            return StaffStatus.valueOf(value.toUpperCase());
        }
    }

    public enum AvailabilityStatus {
        AVAILABLE, BUSY, IN_PERSONAL_BREAK;

        @com.fasterxml.jackson.annotation.JsonCreator
        public static AvailabilityStatus fromString(String value) {
            if (value == null)
                return null;
            return AvailabilityStatus.valueOf(value.replace(" ", "_").toUpperCase());
        }
    }
}
