package com.hospital.management.service;

import com.hospital.management.dto.request.StaffRequest;
import com.hospital.management.dto.response.StaffResponse;
import com.hospital.management.entity.Staff;
import com.hospital.management.exception.ResourceNotFoundException;
import com.hospital.management.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final StaffRepository staffRepository;
    private final com.hospital.management.repository.DepartmentRepository departmentRepository;

    @Transactional(readOnly = true)
    public List<StaffResponse> getAll() {
        return staffRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StaffResponse getById(String id) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found: " + id));
        return toResponse(staff);
    }

    @Transactional
    public StaffResponse create(StaffRequest request) {
        if (staffRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }
        Staff staff = toEntity(request);
        return toResponse(staffRepository.save(staff));
    }

    @Transactional
    public StaffResponse update(String id, StaffRequest request) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found: " + id));

        staff.setFirstName(request.getFirstName());
        staff.setLastName(request.getLastName());
        staff.setEmail(request.getEmail());
        staff.setPhone(request.getPhone());
        staff.setRole(request.getRole());
        staff.setSpecialization(request.getSpecialization());
        if (request.getDepartment() != null) {
            staff.setDepartment(departmentRepository.findByName(request.getDepartment()).orElse(null));
        }

        return toResponse(staffRepository.save(staff));
    }

    @Transactional
    public void delete(String id) {
        if (!staffRepository.existsById(id)) {
            throw new ResourceNotFoundException("Staff not found: " + id);
        }
        staffRepository.deleteById(id);
    }

    @Transactional
    public StaffResponse updateAvailabilityStatus(String id, Staff.AvailabilityStatus status) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found: " + id));
        staff.setAvailabilityStatus(status);
        staff.setUpdatedAt(java.time.LocalDateTime.now());
        return toResponse(staffRepository.save(staff));
    }

    private Staff toEntity(StaffRequest r) {
        Staff staff = new Staff();
        staff.setFirstName(r.getFirstName());
        staff.setLastName(r.getLastName());
        staff.setEmail(r.getEmail());
        staff.setPhone(r.getPhone());
        staff.setRole(r.getRole());
        staff.setSpecialization(r.getSpecialization());
        if (r.getDepartment() != null) {
            staff.setDepartment(departmentRepository.findByName(r.getDepartment()).orElse(null));
        }
        return staff;
    }

    private StaffResponse toResponse(Staff s) {
        StaffResponse res = new StaffResponse();
        res.setId(s.getId());
        res.setFirstName(s.getFirstName());
        res.setLastName(s.getLastName());
        res.setEmail(s.getEmail());
        res.setPhone(s.getPhone());
        res.setRole(s.getRole());
        res.setSpecialization(s.getSpecialization());
        if (s.getDepartment() != null) {
            res.setDepartment(s.getDepartment().getName());
        }
        res.setJoinDate(s.getJoinDate());
        res.setStatus(s.getStatus());
        res.setAvailabilityStatus(s.getAvailabilityStatus());
        res.setCreatedAt(s.getCreatedAt());
        res.setUpdatedAt(s.getUpdatedAt());
        return res;
    }
}



