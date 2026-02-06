package com.hospital.management.service;

import com.hospital.management.dto.request.PrescriptionRequest;
import com.hospital.management.dto.response.PrescriptionResponse;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.Prescription;
import com.hospital.management.exception.ResourceNotFoundException;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;

    @Transactional(readOnly = true)
    public List<PrescriptionResponse> getAll() {
        return prescriptionRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PrescriptionResponse getById(String id) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found: " + id));
        return toResponse(prescription);
    }

    @Transactional
    public PrescriptionResponse create(PrescriptionRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + request.getPatientId()));

        Prescription prescription = new Prescription();
        prescription.setPatient(patient);
        prescription.setPatientName(patient.getFirstName() + " " + patient.getLastName());
        prescription.setMedicationName(request.getMedicationName());
        prescription.setDosage(request.getDosage());
        prescription.setFrequency(request.getFrequency());
        prescription.setDuration(request.getDuration());
        prescription.setPrescribedBy(request.getPrescribedBy());
        prescription.setNotes(request.getNotes());
        prescription.setRefillsRemaining(request.getRefillsRemaining());

        return toResponse(prescriptionRepository.save(prescription));
    }

    @Transactional
    public PrescriptionResponse update(String id, PrescriptionRequest request) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found: " + id));

        prescription.setMedicationName(request.getMedicationName());
        prescription.setDosage(request.getDosage());
        prescription.setFrequency(request.getFrequency());
        prescription.setDuration(request.getDuration());
        prescription.setNotes(request.getNotes());
        prescription.setRefillsRemaining(request.getRefillsRemaining());
        prescription.setUpdatedAt(LocalDateTime.now());

        return toResponse(prescriptionRepository.save(prescription));
    }

    @Transactional
    public void delete(String id) {
        if (!prescriptionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Prescription not found: " + id);
        }
        prescriptionRepository.deleteById(id);
    }

    private PrescriptionResponse toResponse(Prescription p) {
        PrescriptionResponse res = new PrescriptionResponse();
        res.setId(p.getId());
        res.setPatientId(p.getPatient().getId());
        res.setPatientName(p.getPatientName());
        res.setMedicationName(p.getMedicationName());
        res.setDosage(p.getDosage());
        res.setFrequency(p.getFrequency());
        res.setDuration(p.getDuration());
        res.setPrescribedBy(p.getPrescribedBy());
        res.setPrescribedDate(p.getPrescribedDate());
        res.setStatus(p.getStatus());
        res.setNotes(p.getNotes());
        res.setRefillsRemaining(p.getRefillsRemaining());
        res.setCreatedAt(p.getCreatedAt());
        res.setUpdatedAt(p.getUpdatedAt());
        return res;
    }
}



