package com.hospital.management.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PatientDTO {
    private Long id;
    private String patientId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private LocalDate dateOfBirth;
    private String gender;
    private String bloodType;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String status;
    private LocalDate lastVisit;
}
