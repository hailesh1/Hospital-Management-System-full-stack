package com.hospital.management.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AppointmentDTO {
    private Long id;
    private String appointmentId;
    private String title;
    private String description;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime startTime;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime endTime;
    
    private String status;
    private String notes;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime checkedInAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime completedAt;
    
    private Long patientId;
    private String patientName;
    private Long doctorId;
    private String doctorName;
}
