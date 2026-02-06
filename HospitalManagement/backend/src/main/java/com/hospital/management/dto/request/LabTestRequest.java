package com.hospital.management.dto.request;

import com.hospital.management.entity.LabTest;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LabTestRequest {

    @NotBlank(message = "Patient ID is required")
    private String patientId;

    @NotBlank(message = "Test name is required")
    private String testName;

    @NotNull(message = "Test type is required")
    private LabTest.TestType testType;

    @NotBlank(message = "Ordered by is required")
    private String orderedBy;

    private String notes;
}



