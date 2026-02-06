package com.hospital.management.dto.request;

import com.hospital.management.entity.Appointment;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AppointmentRequest {

    @NotBlank(message = "Patient ID is required")
    private String patientId;

    @NotBlank(message = "Doctor ID is required")
    private String doctorId;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotBlank(message = "Time is required")
    private String time;

    @NotNull(message = "Appointment type is required")
    private Appointment.AppointmentType type;

    private String notes;
}



