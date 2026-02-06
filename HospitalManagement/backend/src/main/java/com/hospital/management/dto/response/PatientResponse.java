package com.hospital.management.dto.response;

import com.hospital.management.entity.Patient;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class PatientResponse {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private LocalDate dateOfBirth;
    private Patient.Gender gender;
    private String bloodType;
    private String address;
    private EmergencyContactDto emergencyContact;
    private LocalDateTime registeredDate;
    private Patient.PatientStatus status;

    @Data
    public static class EmergencyContactDto {
        private String name;
        private String phone;
        private String relationship;
    }
}



