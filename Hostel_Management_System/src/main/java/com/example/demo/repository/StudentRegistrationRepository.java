package com.example.demo.repository;

import com.example.demo.model.StudentRegistration;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRegistrationRepository extends MongoRepository<StudentRegistration, String> {

    Optional<StudentRegistration> findByEmail(String email);

    boolean existsByEmail(String email);

    // ✅ NEW - Case-insensitive email check
    boolean existsByEmailIgnoreCase(String email);
}
