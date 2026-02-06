package com.hospital.management.service;

import com.hospital.management.dto.request.LabTestRequest;
import com.hospital.management.dto.response.LabTestResponse;
import com.hospital.management.entity.LabTest;
import com.hospital.management.entity.Patient;
import com.hospital.management.exception.ResourceNotFoundException;
import com.hospital.management.repository.LabTestRepository;
import com.hospital.management.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LabTestService {

    private final LabTestRepository labTestRepository;
    private final PatientRepository patientRepository;

    @Transactional(readOnly = true)
    public List<LabTestResponse> getAll() {
        return labTestRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LabTestResponse getById(String id) {
        LabTest labTest = labTestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lab test not found: " + id));
        return toResponse(labTest);
    }

    @Transactional
    public LabTestResponse create(LabTestRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + request.getPatientId()));

        LabTest labTest = new LabTest();
        labTest.setPatient(patient);
        labTest.setPatientName(patient.getFirstName() + " " + patient.getLastName());
        labTest.setTestName(request.getTestName());
        labTest.setTestType(request.getTestType());
        labTest.setOrderedBy(request.getOrderedBy());
        labTest.setNotes(request.getNotes());

        return toResponse(labTestRepository.save(labTest));
    }

    @Transactional
    public LabTestResponse update(String id, LabTestRequest request) {
        LabTest labTest = labTestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lab test not found: " + id));

        labTest.setTestName(request.getTestName());
        labTest.setTestType(request.getTestType());
        labTest.setNotes(request.getNotes());
        labTest.setUpdatedAt(LocalDateTime.now());

        return toResponse(labTestRepository.save(labTest));
    }

    @Transactional
    public LabTestResponse updateStatus(String id, LabTest.TestStatus status) {
        LabTest labTest = labTestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lab test not found: " + id));
        
        labTest.setStatus(status);
        if (status == LabTest.TestStatus.COMPLETED) {
            labTest.setResultDate(LocalDate.now());
        }
        labTest.setUpdatedAt(LocalDateTime.now());
        
        return toResponse(labTestRepository.save(labTest));
    }

    @Transactional
    public void delete(String id) {
        if (!labTestRepository.existsById(id)) {
            throw new ResourceNotFoundException("Lab test not found: " + id);
        }
        labTestRepository.deleteById(id);
    }

    private LabTestResponse toResponse(LabTest lt) {
        LabTestResponse res = new LabTestResponse();
        res.setId(lt.getId());
        res.setPatientId(lt.getPatient().getId());
        res.setPatientName(lt.getPatientName());
        res.setTestName(lt.getTestName());
        res.setTestType(lt.getTestType());
        res.setOrderedBy(lt.getOrderedBy());
        res.setOrderedDate(lt.getOrderedDate());
        res.setSampleCollectedDate(lt.getSampleCollectedDate());
        res.setResultDate(lt.getResultDate());
        res.setStatus(lt.getStatus());
        res.setResults(lt.getResults());
        res.setNormalRange(lt.getNormalRange());
        res.setNotes(lt.getNotes());
        res.setCreatedAt(lt.getCreatedAt());
        res.setUpdatedAt(lt.getUpdatedAt());
        return res;
    }
}



