package com.example.demo.repository;

import com.example.demo.model.StudentRegistration;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRegistrationRepository extends MongoRepository<StudentRegistration, String> {

    // ✅ Find by email
    Optional<StudentRegistration> findByEmail(String email);

    // ✅ Check if email already exists (case-sensitive)
    boolean existsByEmail(String email);

    // ✅ Case-insensitive email check
    boolean existsByEmailIgnoreCase(String email);

    // ✅ Get all registrations with specific status (e.g. PENDING)
    List<StudentRegistration> findByStatus(String status);
}
