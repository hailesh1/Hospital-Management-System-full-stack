package com.hospital.management.service;

import com.hospital.management.dto.request.MedicalRecordRequest;
import com.hospital.management.dto.response.MedicalRecordResponse;
import com.hospital.management.entity.MedicalRecord;
import com.hospital.management.entity.MedicalRecordFile;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.Staff;
import com.hospital.management.exception.ResourceNotFoundException;
import com.hospital.management.repository.MedicalRecordRepository;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.StaffRepository;
import com.hospital.management.service.MinioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final PatientRepository patientRepository;
    private final StaffRepository staffRepository;
    private final MinioService minioService;

    @Transactional(readOnly = true)
    public List<MedicalRecordResponse> getAll() {
        return medicalRecordRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MedicalRecordResponse getById(String id) {
        MedicalRecord record = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medical record not found: " + id));
        return toResponse(record);
    }

    @Transactional
    public MedicalRecordResponse create(MedicalRecordRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + request.getPatientId()));

        Staff doctor = staffRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found: " + request.getDoctorId()));

        MedicalRecord record = new MedicalRecord();
        record.setPatient(patient);
        record.setPatientName(patient.getFirstName() + " " + patient.getLastName());
        record.setDate(request.getDate() != null ? request.getDate() : java.time.LocalDate.now());
        record.setDiagnosis(request.getDiagnosis());
        record.setTreatment(request.getTreatment());
        record.setPrescriptions(request.getPrescriptions());
        record.setDoctor(doctor);
        record.setDoctorName(doctor.getFirstName() + " " + doctor.getLastName());

        return toResponse(medicalRecordRepository.save(record));
    }

    @Transactional
    public MedicalRecordResponse addFile(String recordId, MultipartFile file) throws Exception {
        MedicalRecord record = medicalRecordRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("Medical record not found: " + recordId));

        String fileName = minioService.uploadFile(file, "medical-records");
        String fileUrl = "/api/files/" + fileName;

        MedicalRecordFile recordFile = new MedicalRecordFile();
        recordFile.setName(file.getOriginalFilename());
        recordFile.setType(file.getContentType());
        recordFile.setUrl(fileUrl);
        recordFile.setMedicalRecord(record);
        record.getFiles().add(recordFile);

        return toResponse(medicalRecordRepository.save(record));
    }

    @Transactional
    public void delete(String id) {
        if (!medicalRecordRepository.existsById(id)) {
            throw new ResourceNotFoundException("Medical record not found: " + id);
        }
        medicalRecordRepository.deleteById(id);
    }

    private MedicalRecordResponse toResponse(MedicalRecord mr) {
        MedicalRecordResponse res = new MedicalRecordResponse();
        res.setId(mr.getId());
        res.setPatientId(mr.getPatient().getId());
        res.setPatientName(mr.getPatientName());
        res.setDate(mr.getDate());
        res.setDiagnosis(mr.getDiagnosis());
        res.setTreatment(mr.getTreatment());
        res.setPrescriptions(mr.getPrescriptions());
        res.setDoctorId(mr.getDoctor().getId());
        res.setDoctorName(mr.getDoctorName());
        res.setFiles(mr.getFiles().stream().map(f -> {
            MedicalRecordResponse.MedicalRecordFileDto dto = new MedicalRecordResponse.MedicalRecordFileDto();
            dto.setId(f.getId());
            dto.setName(f.getName());
            dto.setType(f.getType());
            dto.setUrl(f.getUrl());
            return dto;
        }).collect(Collectors.toList()));
        res.setCreatedAt(mr.getCreatedAt());
        res.setUpdatedAt(mr.getUpdatedAt());
        return res;
    }
}

