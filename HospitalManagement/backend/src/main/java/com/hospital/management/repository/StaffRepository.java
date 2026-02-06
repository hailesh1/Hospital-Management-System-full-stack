package com.hospital.management.repository;

import com.hospital.management.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, String> {
    
    Optional<Staff> findByEmail(String email);
    
    List<Staff> findByStatus(Staff.StaffStatus status);
    
    List<Staff> findByRole(Staff.StaffRole role);
    
    List<Staff> findByDepartmentName(String departmentName);
    
    List<Staff> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String firstName, String lastName, String email);
}



