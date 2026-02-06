package com.hospital.management.dto.response;

import com.hospital.management.entity.Staff;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class StaffResponse {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Staff.StaffRole role;
    private String specialization;
    private String department;
    private LocalDate joinDate;
    private Staff.StaffStatus status;
    private Staff.AvailabilityStatus availabilityStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}



