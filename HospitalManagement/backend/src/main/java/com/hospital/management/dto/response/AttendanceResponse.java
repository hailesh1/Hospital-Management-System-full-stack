package com.hospital.management.dto.response;

import com.hospital.management.entity.Attendance;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class AttendanceResponse {
    private String id;
    private String staffId;
    private String staffName;
    private LocalDate date;
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;
    private Attendance.AttendanceStatus status;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}



