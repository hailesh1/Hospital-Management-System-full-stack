package com.hospital.management.controller;

import com.hospital.management.dto.request.PrescriptionRequest;
import com.hospital.management.dto.response.PrescriptionResponse;
import com.hospital.management.service.PrescriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    public ResponseEntity<List<PrescriptionResponse>> getAll() {
        return ResponseEntity.ok(prescriptionService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    public ResponseEntity<PrescriptionResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(prescriptionService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<PrescriptionResponse> create(@Valid @RequestBody PrescriptionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(prescriptionService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<PrescriptionResponse> update(
            @PathVariable String id,
            @Valid @RequestBody PrescriptionRequest request) {
        return ResponseEntity.ok(prescriptionService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        prescriptionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}



