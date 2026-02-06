package com.hospital.management.dto.request;

import lombok.Data;

@Data
public class VitalSignsRequest {
    private String patientId;
    private String appointmentId;
    private Double weight; // in kg
    private Double height; // in cm
    private String bloodPressure; // e.g., "120/80"
    private Double temperature; // in Celsius
    private Integer pulse; // beats per minute
    private Integer respiratoryRate;
}
