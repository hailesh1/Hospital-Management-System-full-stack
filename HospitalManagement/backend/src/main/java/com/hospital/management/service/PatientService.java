package com.hospital.management.service;

import com.hospital.management.dto.request.PatientRequest;
import com.hospital.management.dto.response.PatientResponse;
import com.hospital.management.entity.Patient;
import com.hospital.management.exception.ResourceNotFoundException;
import com.hospital.management.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;

    @Transactional(readOnly = true)
    public List<PatientResponse> getAll() {
        return patientRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PatientResponse getById(String id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + id));
        return toResponse(patient);
    }

    @Transactional
    public PatientResponse create(PatientRequest request) {
        if (patientRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }
        Patient patient = toEntity(request);
        return toResponse(patientRepository.save(patient));
    }

    @Transactional
    public PatientResponse update(String id, PatientRequest request) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + id));

        patient.setFirstName(request.getFirstName());
        patient.setLastName(request.getLastName());
        patient.setEmail(request.getEmail());
        patient.setPhone(request.getPhone());
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setGender(request.getGender());
        patient.setBloodType(request.getBloodType());
        patient.setAddress(request.getAddress());

        if (request.getEmergencyContact() != null) {
            Patient.EmergencyContact ec = new Patient.EmergencyContact(
                    request.getEmergencyContact().getName(),
                    request.getEmergencyContact().getPhone(),
                    request.getEmergencyContact().getRelationship()
            );
            patient.setEmergencyContact(ec);
        }

        return toResponse(patientRepository.save(patient));
    }

    @Transactional
    public void delete(String id) {
        if (!patientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Patient not found: " + id);
        }
        patientRepository.deleteById(id);
    }

    private Patient toEntity(PatientRequest r) {
        Patient patient = new Patient();
        patient.setFirstName(r.getFirstName());
        patient.setLastName(r.getLastName());
        patient.setEmail(r.getEmail());
        patient.setPhone(r.getPhone());
        patient.setDateOfBirth(r.getDateOfBirth());
        patient.setGender(r.getGender());
        patient.setBloodType(r.getBloodType());
        patient.setAddress(r.getAddress());
        if (r.getEmergencyContact() != null) {
            patient.setEmergencyContact(new Patient.EmergencyContact(
                    r.getEmergencyContact().getName(),
                    r.getEmergencyContact().getPhone(),
                    r.getEmergencyContact().getRelationship()
            ));
        }
        return patient;
    }

    private PatientResponse toResponse(Patient p) {
        PatientResponse res = new PatientResponse();
        res.setId(p.getId());
        res.setFirstName(p.getFirstName());
        res.setLastName(p.getLastName());
        res.setEmail(p.getEmail());
        res.setPhone(p.getPhone());
        res.setDateOfBirth(p.getDateOfBirth());
        res.setGender(p.getGender());
        res.setBloodType(p.getBloodType());
        res.setAddress(p.getAddress());
        res.setRegisteredDate(p.getRegisteredDate());
        res.setStatus(p.getStatus());
        if (p.getEmergencyContact() != null) {
            PatientResponse.EmergencyContactDto dto = new PatientResponse.EmergencyContactDto();
            dto.setName(p.getEmergencyContact().getName());
            dto.setPhone(p.getEmergencyContact().getPhone());
            dto.setRelationship(p.getEmergencyContact().getRelationship());
            res.setEmergencyContact(dto);
        }
        return res;
    }
}



