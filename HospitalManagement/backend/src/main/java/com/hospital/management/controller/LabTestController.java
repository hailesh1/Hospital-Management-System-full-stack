package com.hospital.management.controller;

import com.hospital.management.dto.request.LabTestRequest;
import com.hospital.management.dto.response.LabTestResponse;
import com.hospital.management.entity.LabTest;
import com.hospital.management.service.LabTestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lab-tests")
@RequiredArgsConstructor
public class LabTestController {

    private final LabTestService labTestService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    public ResponseEntity<List<LabTestResponse>> getAll() {
        return ResponseEntity.ok(labTestService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    public ResponseEntity<LabTestResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(labTestService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<LabTestResponse> create(@Valid @RequestBody LabTestRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(labTestService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<LabTestResponse> update(
            @PathVariable String id,
            @Valid @RequestBody LabTestRequest request) {
        return ResponseEntity.ok(labTestService.update(id, request));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<LabTestResponse> updateStatus(
            @PathVariable String id,
            @RequestParam LabTest.TestStatus status) {
        return ResponseEntity.ok(labTestService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        labTestService.delete(id);
        return ResponseEntity.noContent().build();
    }
}



