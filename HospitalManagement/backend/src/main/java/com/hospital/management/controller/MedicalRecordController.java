package com.hospital.management.controller;

import com.hospital.management.dto.request.MedicalRecordRequest;
import com.hospital.management.dto.response.MedicalRecordResponse;
import com.hospital.management.service.MedicalRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/medical-records")
@RequiredArgsConstructor
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    public ResponseEntity<List<MedicalRecordResponse>> getAll() {
        return ResponseEntity.ok(medicalRecordService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    public ResponseEntity<MedicalRecordResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(medicalRecordService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<MedicalRecordResponse> create(@Valid @RequestBody MedicalRecordRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(medicalRecordService.create(request));
    }

    @PostMapping("/{id}/files")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<MedicalRecordResponse> addFile(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) throws Exception {
        return ResponseEntity.ok(medicalRecordService.addFile(id, file));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        medicalRecordService.delete(id);
        return ResponseEntity.noContent().build();
    }
}



