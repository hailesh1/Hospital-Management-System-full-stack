package com.hospital.management.repository;

import com.hospital.management.entity.Attendance;
import com.hospital.management.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, String> {
    
    List<Attendance> findByStaff(Staff staff);
    
    List<Attendance> findByDate(LocalDate date);
    
    List<Attendance> findByDateBetween(LocalDate startDate, LocalDate endDate);
    
    Optional<Attendance> findByStaffAndDate(Staff staff, LocalDate date);
    
    List<Attendance> findByStatus(Attendance.AttendanceStatus status);
}
