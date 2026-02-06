package com.hospital.management.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
public class MedicalRecordRequest {

    @NotBlank(message = "Patient ID is required")
    private String patientId;

    private LocalDate date;

    @NotBlank(message = "Diagnosis is required")
    private String diagnosis;

    @NotBlank(message = "Treatment is required")
    private String treatment;

    private List<String> prescriptions = new ArrayList<>();

    @NotBlank(message = "Doctor ID is required")
    private String doctorId;
}



