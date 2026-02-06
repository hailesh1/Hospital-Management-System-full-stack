package com.hospital.management.config;

import com.hospital.management.entity.Patient;
import com.hospital.management.entity.Staff;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final StaffRepository staffRepository;
    private final PatientRepository patientRepository;
    private final com.hospital.management.repository.DepartmentRepository departmentRepository;
    private final com.hospital.management.entity.Department cardiology = com.hospital.management.entity.Department.builder().name("Cardiology").build();
    private final com.hospital.management.entity.Department outpatient = com.hospital.management.entity.Department.builder().name("General Outpatient").build();
    private final com.hospital.management.entity.Department neurology = com.hospital.management.entity.Department.builder().name("Neurology").build();
    private final com.hospital.management.entity.Department pediatrics = com.hospital.management.entity.Department.builder().name("Pediatrics").build();

    @Override
    public void run(String... args) {
        log.info("Checking if data seeding is required...");
        seedDepartments();
        seedStaff();
        seedPatients();
    }

    private void seedDepartments() {
        if (departmentRepository.count() == 0) {
            log.info("Seeding department data...");
            departmentRepository.saveAll(List.of(cardiology, outpatient, neurology, pediatrics));
        }
    }

    private void seedStaff() {
        if (staffRepository.count() == 0) {
            log.info("Seeding staff data...");
            List<Staff> staffList = List.of(
                Staff.builder()
                    .firstName("Hiwot")
                    .lastName("Ketma")
                    .email("hiwot@hospital.com")
                    .phone("+251 911 111111")
                    .role(Staff.StaffRole.DOCTOR)
                    .specialization("Cardiology")
                    .department(departmentRepository.findByName("Cardiology").orElse(null))
                    .status(Staff.StaffStatus.ACTIVE)
                    .build(),
                Staff.builder()
                    .firstName("Alemu")
                    .lastName("Belay")
                    .email("alemu@hospital.com")
                    .phone("+251 911 222222")
                    .role(Staff.StaffRole.DOCTOR)
                    .specialization("General Medicine")
                    .department(departmentRepository.findByName("General Outpatient").orElse(null))
                    .status(Staff.StaffStatus.ACTIVE)
                    .build(),
                Staff.builder()
                    .firstName("Marekan")
                    .lastName("Haset")
                    .email("marekan@hospital.com")
                    .phone("+251 911 333333")
                    .role(Staff.StaffRole.DOCTOR)
                    .specialization("Neurology")
                    .department(departmentRepository.findByName("Neurology").orElse(null))
                    .status(Staff.StaffStatus.ACTIVE)
                    .build(),
                Staff.builder()
                    .firstName("Rakeb")
                    .lastName("Taye")
                    .email("rakeb@hospital.com")
                    .phone("+251 911 444444")
                    .role(Staff.StaffRole.DOCTOR)
                    .specialization("Pediatrics")
                    .department(departmentRepository.findByName("Pediatrics").orElse(null))
                    .status(Staff.StaffStatus.ACTIVE)
                    .build(),
                Staff.builder()
                    .firstName("Rahel")
                    .lastName("Miteku")
                    .email("rahel@hospital.com")
                    .phone("+251 911 555555")
                    .role(Staff.StaffRole.DOCTOR)
                    .specialization("Neurology")
                    .department(departmentRepository.findByName("Neurology").orElse(null))
                    .status(Staff.StaffStatus.ACTIVE)
                    .build(),
                Staff.builder()
                    .firstName("Admin")
                    .lastName("System")
                    .email("admin@hospital.com")
                    .phone("+251 911 000000")
                    .role(Staff.StaffRole.ADMIN)
                    .status(Staff.StaffStatus.ACTIVE)
                    .build(),
                Staff.builder()
                    .firstName("Reception")
                    .lastName("Staff")
                    .email("receptionist@hospital.com")
                    .phone("+251 911 999999")
                    .role(Staff.StaffRole.RECEPTIONIST)
                    .status(Staff.StaffStatus.ACTIVE)
                    .build()
            );
            staffRepository.saveAll(staffList);
            log.info("Staff data seeded successfully.");
        }
    }

    private void seedPatients() {
        if (patientRepository.count() == 0) {
            log.info("Seeding patient data...");
            List<Patient> patients = List.of(
                Patient.builder()
                    .firstName("Jara")
                    .lastName("tesema")
                    .email("jara@example.com")
                    .phone("+251 922 111111")
                    .dateOfBirth(LocalDate.of(1990, 5, 15))
                    .gender(Patient.Gender.MALE)
                    .bloodType("O+")
                    .status(Patient.PatientStatus.ACTIVE)
                    .build(),
                Patient.builder()
                    .firstName("Akelilu")
                    .lastName("Besufekad")
                    .email("akelilu@example.com")
                    .phone("+251 922 222222")
                    .dateOfBirth(LocalDate.of(1985, 8, 22))
                    .gender(Patient.Gender.MALE)
                    .bloodType("A+")
                    .status(Patient.PatientStatus.ACTIVE)
                    .build(),
                Patient.builder()
                    .firstName("Yetenayet")
                    .lastName("Bilew")
                    .email("yetenayet@example.com")
                    .phone("+251 922 333333")
                    .dateOfBirth(LocalDate.of(1978, 11, 30))
                    .gender(Patient.Gender.FEMALE)
                    .bloodType("B-")
                    .status(Patient.PatientStatus.ACTIVE)
                    .build(),
                Patient.builder()
                    .firstName("Yalem")
                    .lastName("Ademas")
                    .email("yalem@example.com")
                    .phone("+251 922 444444")
                    .dateOfBirth(LocalDate.of(1995, 3, 10))
                    .gender(Patient.Gender.MALE)
                    .bloodType("AB+")
                    .status(Patient.PatientStatus.ACTIVE)
                    .build(),
                Patient.builder()
                    .firstName("kiya")
                    .lastName("Zerihun")
                    .email("kiya@example.com")
                    .phone("+251 922 555555")
                    .dateOfBirth(LocalDate.of(2000, 7, 25))
                    .gender(Patient.Gender.FEMALE)
                    .bloodType("O-")
                    .status(Patient.PatientStatus.ACTIVE)
                    .build()
            );
            patientRepository.saveAll(patients);
            log.info("Patient data seeded successfully.");
        }
    }
}
