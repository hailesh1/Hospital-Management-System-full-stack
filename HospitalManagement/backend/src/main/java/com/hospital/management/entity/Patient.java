package com.hospital.management.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "patients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

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

    @Column(nullable = false)
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;

    private String bloodType;

    private String address;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "name", column = @Column(name = "emergency_name")),
            @AttributeOverride(name = "phone", column = @Column(name = "emergency_phone")),
            @AttributeOverride(name = "relationship", column = @Column(name = "emergency_relationship"))
    })
    private EmergencyContact emergencyContact;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime registeredDate = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PatientStatus status = PatientStatus.ACTIVE;

    private String createdBy;

    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EmergencyContact {
        private String name;
        private String phone;
        private String relationship;
    }

    public enum Gender {
        MALE, FEMALE, OTHER;

        @com.fasterxml.jackson.annotation.JsonCreator
        public static Gender fromString(String value) {
            if (value == null)
                return null;
            return Gender.valueOf(value.toUpperCase());
        }
    }

    public enum PatientStatus {
        ACTIVE, INACTIVE;

        @com.fasterxml.jackson.annotation.JsonCreator
        public static PatientStatus fromString(String value) {
            if (value == null)
                return null;
            return PatientStatus.valueOf(value.toUpperCase());
        }
    }
}
