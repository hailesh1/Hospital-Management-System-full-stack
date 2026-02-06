package com.hospital.management.controller;

import com.hospital.management.dto.request.StaffRequest;
import com.hospital.management.dto.response.StaffResponse;
import com.hospital.management.service.StaffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')")
    public ResponseEntity<List<StaffResponse>> getAll() {
        return ResponseEntity.ok(staffService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')")
    public ResponseEntity<StaffResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(staffService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StaffResponse> create(@Valid @RequestBody StaffRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(staffService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StaffResponse> update(
            @PathVariable String id,
            @Valid @RequestBody StaffRequest request) {
        return ResponseEntity.ok(staffService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        staffService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')")
    public ResponseEntity<StaffResponse> updateStatus(
            @PathVariable String id,
            @RequestBody java.util.Map<String, String> body) {
        String statusStr = body.get("status");
        com.hospital.management.entity.Staff.AvailabilityStatus status = 
                com.hospital.management.entity.Staff.AvailabilityStatus.fromString(statusStr);
        return ResponseEntity.ok(staffService.updateAvailabilityStatus(id, status));
    }
}



