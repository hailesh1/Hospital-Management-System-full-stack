package com.hospital.management.dto;

import lombok.Data;

@Data
public class DoctorDTO {
    private Long id;
    private String doctorId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String specialization;
    private String department;
    private String status;
}
