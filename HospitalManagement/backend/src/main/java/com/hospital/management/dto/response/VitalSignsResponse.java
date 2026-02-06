package com.hospital.management.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class VitalSignsResponse {
    private String id;
    private String patientId;
    private String appointmentId;
    private Double weight;
    private Double height;
    private String bloodPressure;
    private Double temperature;
    private Integer pulse;
    private Integer respiratoryRate;
    private LocalDateTime recordedAt;
}
