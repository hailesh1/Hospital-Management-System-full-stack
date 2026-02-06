package com.hospital.management.controller;

import com.hospital.management.dto.request.VitalSignsRequest;
import com.hospital.management.dto.response.VitalSignsResponse;
import com.hospital.management.service.VitalSignsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vital-signs")
@RequiredArgsConstructor
public class VitalSignsController {

    private final VitalSignsService vitalSignsService;

    @GetMapping
    public ResponseEntity<List<VitalSignsResponse>> getAll() {
        return ResponseEntity.ok(vitalSignsService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VitalSignsResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(vitalSignsService.getById(id));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<VitalSignsResponse>> getByPatientId(@PathVariable String patientId) {
        return ResponseEntity.ok(vitalSignsService.getByPatientId(patientId));
    }

    @PostMapping
    public ResponseEntity<VitalSignsResponse> create(@RequestBody VitalSignsRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(vitalSignsService.create(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        vitalSignsService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
