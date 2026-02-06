package com.hospital.management.dto.response;

import com.hospital.management.entity.LabTest;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class LabTestResponse {
    private String id;
    private String patientId;
    private String patientName;
    private String testName;
    private LabTest.TestType testType;
    private String orderedBy;
    private LocalDate orderedDate;
    private LocalDate sampleCollectedDate;
    private LocalDate resultDate;
    private LabTest.TestStatus status;
    private String results;
    private String normalRange;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}



