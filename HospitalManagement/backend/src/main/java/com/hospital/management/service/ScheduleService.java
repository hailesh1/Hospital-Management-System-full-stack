package com.hospital.management.service;

import com.hospital.management.dto.request.ScheduleRequest;
import com.hospital.management.dto.response.ScheduleResponse;
import com.hospital.management.entity.Schedule;
import com.hospital.management.entity.Staff;
import com.hospital.management.exception.ResourceNotFoundException;
import com.hospital.management.repository.ScheduleRepository;
import com.hospital.management.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final StaffRepository staffRepository;

    @Transactional(readOnly = true)
    public List<ScheduleResponse> getAll() {
        return scheduleRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ScheduleResponse getById(String id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found: " + id));
        return toResponse(schedule);
    }

    @Transactional
    public ScheduleResponse create(ScheduleRequest request) {
        Staff staff = staffRepository.findById(request.getStaffId())
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found: " + request.getStaffId()));

        Schedule schedule = new Schedule();
        schedule.setStaff(staff);
        schedule.setStaffName(staff.getFirstName() + " " + staff.getLastName());
        schedule.setDate(request.getDate());
        schedule.setShiftType(request.getShiftType());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        schedule.setDepartment(request.getDepartment());

        return toResponse(scheduleRepository.save(schedule));
    }

    @Transactional
    public ScheduleResponse update(String id, ScheduleRequest request) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found: " + id));

        schedule.setDate(request.getDate());
        schedule.setShiftType(request.getShiftType());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        schedule.setDepartment(request.getDepartment());
        schedule.setUpdatedAt(LocalDateTime.now());

        return toResponse(scheduleRepository.save(schedule));
    }

    @Transactional
    public void delete(String id) {
        if (!scheduleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Schedule not found: " + id);
        }
        scheduleRepository.deleteById(id);
    }

    private ScheduleResponse toResponse(Schedule s) {
        ScheduleResponse res = new ScheduleResponse();
        res.setId(s.getId());
        res.setStaffId(s.getStaff().getId());
        res.setStaffName(s.getStaffName());
        res.setDate(s.getDate());
        res.setShiftType(s.getShiftType());
        res.setStartTime(s.getStartTime());
        res.setEndTime(s.getEndTime());
        res.setDepartment(s.getDepartment());
        res.setStatus(s.getStatus());
        res.setCreatedAt(s.getCreatedAt());
        res.setUpdatedAt(s.getUpdatedAt());
        return res;
    }
}



