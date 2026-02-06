package com.hospital.management.dto.request;

import com.hospital.management.entity.Schedule;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ScheduleRequest {

    @NotBlank(message = "Staff ID is required")
    private String staffId;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Shift type is required")
    private Schedule.ShiftType shiftType;

    @NotBlank(message = "Start time is required")
    private String startTime;

    @NotBlank(message = "End time is required")
    private String endTime;

    @NotBlank(message = "Department is required")
    private String department;
}



