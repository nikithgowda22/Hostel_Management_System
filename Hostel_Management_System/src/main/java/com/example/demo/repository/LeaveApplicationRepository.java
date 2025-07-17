package com.example.demo.repository;

import com.example.demo.model.LeaveApplication;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveApplicationRepository extends MongoRepository<LeaveApplication, String> {
    List<LeaveApplication> findByStudentEmail(String email);
    List<LeaveApplication> findByStatus(String status);
}
