package com.hospital.management.service;

import com.hospital.management.dto.request.VitalSignsRequest;
import com.hospital.management.dto.response.VitalSignsResponse;
import com.hospital.management.entity.VitalSigns;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.Appointment;
import com.hospital.management.exception.ResourceNotFoundException;
import com.hospital.management.repository.VitalSignsRepository;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VitalSignsService {

    private final VitalSignsRepository vitalSignsRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    @Transactional(readOnly = true)
    public List<VitalSignsResponse> getAll() {
        return vitalSignsRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public VitalSignsResponse getById(String id) {
        VitalSigns vitalSigns = vitalSignsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vital signs not found: " + id));
        return toResponse(vitalSigns);
    }

    @Transactional(readOnly = true)
    public List<VitalSignsResponse> getByPatientId(String patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + patientId));
        return vitalSignsRepository.findByPatientOrderByRecordedAtDesc(patient).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public VitalSignsResponse create(VitalSignsRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + request.getPatientId()));

        VitalSigns vitalSigns = VitalSigns.builder()
                .patient(patient)
                .weight(request.getWeight())
                .height(request.getHeight())
                .bloodPressure(request.getBloodPressure())
                .temperature(request.getTemperature())
                .pulse(request.getPulse())
                .respiratoryRate(request.getRespiratoryRate())
                .build();

        if (request.getAppointmentId() != null) {
            Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + request.getAppointmentId()));
            vitalSigns.setAppointment(appointment);
        }

        return toResponse(vitalSignsRepository.save(vitalSigns));
    }

    @Transactional
    public void delete(String id) {
        if (!vitalSignsRepository.existsById(id)) {
            throw new ResourceNotFoundException("Vital signs not found: " + id);
        }
        vitalSignsRepository.deleteById(id);
    }

    private VitalSignsResponse toResponse(VitalSigns vs) {
        VitalSignsResponse response = new VitalSignsResponse();
        response.setId(vs.getId());
        response.setPatientId(vs.getPatient().getId());
        if (vs.getAppointment() != null) {
            response.setAppointmentId(vs.getAppointment().getId());
        }
        response.setWeight(vs.getWeight());
        response.setHeight(vs.getHeight());
        response.setBloodPressure(vs.getBloodPressure());
        response.setTemperature(vs.getTemperature());
        response.setPulse(vs.getPulse());
        response.setRespiratoryRate(vs.getRespiratoryRate());
        response.setRecordedAt(vs.getRecordedAt());
        return response;
    }
}
