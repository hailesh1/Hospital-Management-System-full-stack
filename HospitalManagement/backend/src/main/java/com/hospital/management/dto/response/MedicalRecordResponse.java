package com.hospital.management.dto.response;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class MedicalRecordResponse {
    private String id;
    private String patientId;
    private String patientName;
    private LocalDate date;
    private String diagnosis;
    private String treatment;
    private List<String> prescriptions = new ArrayList<>();
    private String doctorId;
    private String doctorName;
    private List<MedicalRecordFileDto> files = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    public static class MedicalRecordFileDto {
        private String id;
        private String name;
        private String type;
        private String url;
    }
}



