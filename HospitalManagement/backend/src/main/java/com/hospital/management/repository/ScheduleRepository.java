package com.hospital.management.repository;

import com.hospital.management.entity.Schedule;
import com.hospital.management.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, String> {
    
    List<Schedule> findByStaff(Staff staff);
    
    List<Schedule> findByDate(LocalDate date);
    
    List<Schedule> findByStatus(Schedule.ScheduleStatus status);
    
    List<Schedule> findByDateAndStatus(LocalDate date, Schedule.ScheduleStatus status);
}



