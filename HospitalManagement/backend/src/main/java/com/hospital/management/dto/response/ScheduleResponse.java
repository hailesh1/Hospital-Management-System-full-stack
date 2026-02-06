package com.hospital.management.dto.response;

import com.hospital.management.entity.Schedule;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ScheduleResponse {
    private String id;
    private String staffId;
    private String staffName;
    private LocalDate date;
    private Schedule.ShiftType shiftType;
    private String startTime;
    private String endTime;
    private String department;
    private Schedule.ScheduleStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}



