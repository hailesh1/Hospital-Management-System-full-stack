package com.hospital.management.service;

import com.hospital.management.dto.request.AppointmentRequest;
import com.hospital.management.dto.response.AppointmentResponse;
import com.hospital.management.entity.Appointment;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.Staff;
import com.hospital.management.exception.ResourceNotFoundException;
import com.hospital.management.repository.AppointmentRepository;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final StaffRepository staffRepository;

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAll() {
        return appointmentRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AppointmentResponse getById(String id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + id));
        return toResponse(appointment);
    }

    @Transactional
    public AppointmentResponse create(AppointmentRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + request.getPatientId()));

        Staff doctor = staffRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found: " + request.getDoctorId()));

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setPatientName(patient.getFirstName() + " " + patient.getLastName());
        appointment.setDoctor(doctor);
        appointment.setDoctorName(doctor.getFirstName() + " " + doctor.getLastName());
        appointment.setDate(request.getDate());
        appointment.setTime(request.getTime());
        appointment.setType(request.getType());
        appointment.setNotes(request.getNotes());

        return toResponse(appointmentRepository.save(appointment));
    }

    @Transactional
    public AppointmentResponse update(String id, AppointmentRequest request) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + id));

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + request.getPatientId()));

        Staff doctor = staffRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found: " + request.getDoctorId()));

        appointment.setPatient(patient);
        appointment.setPatientName(patient.getFirstName() + " " + patient.getLastName());
        appointment.setDoctor(doctor);
        appointment.setDoctorName(doctor.getFirstName() + " " + doctor.getLastName());
        appointment.setDate(request.getDate());
        appointment.setTime(request.getTime());
        appointment.setType(request.getType());
        appointment.setNotes(request.getNotes());
        appointment.setUpdatedAt(LocalDateTime.now());

        return toResponse(appointmentRepository.save(appointment));
    }

    @Transactional
    public AppointmentResponse checkIn(String id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + id));
        appointment.setStatus(Appointment.AppointmentStatus.IN_PROGRESS);
        appointment.setCheckedInAt(LocalDateTime.now());
        appointment.setUpdatedAt(LocalDateTime.now());
        return toResponse(appointmentRepository.save(appointment));
    }

    @Transactional
    public AppointmentResponse complete(String id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + id));
        appointment.setStatus(Appointment.AppointmentStatus.COMPLETED);
        appointment.setCompletedAt(LocalDateTime.now());
        appointment.setUpdatedAt(LocalDateTime.now());
        return toResponse(appointmentRepository.save(appointment));
    }

    @Transactional
    public AppointmentResponse cancel(String id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + id));
        appointment.setStatus(Appointment.AppointmentStatus.CANCELLED);
        appointment.setUpdatedAt(LocalDateTime.now());
        return toResponse(appointmentRepository.save(appointment));
    }

    @Transactional
    public void delete(String id) {
        if (!appointmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Appointment not found: " + id);
        }
        appointmentRepository.deleteById(id);
    }

    private AppointmentResponse toResponse(Appointment a) {
        AppointmentResponse res = new AppointmentResponse();
        res.setId(a.getId());
        res.setPatientId(a.getPatient().getId());
        res.setPatientName(a.getPatientName());
        res.setDoctorId(a.getDoctor().getId());
        res.setDoctorName(a.getDoctorName());
        res.setDate(a.getDate());
        res.setTime(a.getTime());
        res.setType(a.getType());
        res.setStatus(a.getStatus());
        res.setNotes(a.getNotes());
        res.setCheckedInAt(a.getCheckedInAt());
        res.setCompletedAt(a.getCompletedAt());
        res.setCreatedAt(a.getCreatedAt());
        res.setUpdatedAt(a.getUpdatedAt());
        return res;
    }
}



