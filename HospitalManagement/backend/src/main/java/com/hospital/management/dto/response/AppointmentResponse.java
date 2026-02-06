package com.hospital.management.dto.response;

import com.hospital.management.entity.Appointment;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class AppointmentResponse {
    private String id;
    private String patientId;
    private String patientName;
    private String doctorId;
    private String doctorName;
    private LocalDate date;
    private String time;
    private Appointment.AppointmentType type;
    private Appointment.AppointmentStatus status;
    private String notes;
    private LocalDateTime checkedInAt;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}



