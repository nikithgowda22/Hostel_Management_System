package com.example.demo.controller;

import com.example.demo.model.AccessLog;
import com.example.demo.model.Complaint;
import com.example.demo.model.Feedback;
import com.example.demo.model.StudentRegistration;
import com.example.demo.repository.AccessLogRepository;
import com.example.demo.repository.ComplaintRepository;
import com.example.demo.repository.FeedbackRepository;
import com.example.demo.repository.StudentRegistrationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/student")
public class StudentController {

    private static final Logger logger = LoggerFactory.getLogger(StudentController.class);

    @Autowired
    private StudentRegistrationRepository registrationRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private AccessLogRepository accessLogRepository;

    // 1. Register a student
    @PostMapping("/register")
    public ResponseEntity<?> registerStudent(@RequestBody StudentRegistration registration) {
        try {
            if (registration.getEmail() == null || registration.getEmail().trim().isEmpty()) {
                logger.warn("Registration failed - email is required");
                return ResponseEntity.badRequest().body("❌ Email is required.");
            }

            String normalizedEmail = registration.getEmail().trim().toLowerCase();
            registration.setEmail(normalizedEmail);

            logger.info("Checking if email already exists: {}", normalizedEmail);
            if (registrationRepository.existsByEmailIgnoreCase(normalizedEmail)) {
                logger.warn("Duplicate registration attempt: {}", normalizedEmail);
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("❌ You have already registered. Please wait for a response within 24 hours.");
            }

            String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
            String regNo = "REG-" + datePart + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
            registration.setRegNo(regNo);

            // Set default status to PENDING
            registration.setStatus("PENDING");

            StudentRegistration saved = registrationRepository.save(registration);
            logger.info("Registered successfully: {} ({})", saved.getName(), normalizedEmail);

            return ResponseEntity.ok("✅ Application submitted successfully! Wait for the response within 24 hours.");
        } catch (Exception e) {
            logger.error("Registration failed for email: {}", registration.getEmail(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Registration failed. Please try again later.");
        }
    }

    // 2. Check if already registered
    @GetMapping("/check")
    public ResponseEntity<?> checkIfRegistered(@RequestParam String email) {
        try {
            String normalizedEmail = email.trim().toLowerCase();
            boolean isRegistered = registrationRepository.existsByEmailIgnoreCase(normalizedEmail);
            return ResponseEntity.ok(Map.of("isRegistered", isRegistered));
        } catch (Exception e) {
            logger.error("Error checking registration for email: {}", email, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to check registration status."));
        }
    }

    // 3. File a complaint
    @PostMapping("/complaints")
    public ResponseEntity<String> fileComplaint(@RequestBody Complaint complaint) {
        complaint.setDate(LocalDate.now().toString());
        complaintRepository.save(complaint);
        return ResponseEntity.ok("Complaint filed successfully");
    }

    // 4. Submit feedback
    @PostMapping("/feedback")
    public ResponseEntity<String> submitFeedback(@RequestBody Feedback feedback) {
        feedback.setDate(LocalDate.now().toString());
        feedbackRepository.save(feedback);
        return ResponseEntity.ok("Feedback submitted successfully");
    }

    // 5. Log access
    @PostMapping("/logs")
    public ResponseEntity<String> logAccess(@RequestBody AccessLog log) {
        log.setTimestamp(LocalDateTime.now().toString());
        accessLogRepository.save(log);
        return ResponseEntity.ok("Log recorded");
    }

    // 6. Get logs for a student
    @GetMapping("/logs")
    public List<AccessLog> getLogs(@RequestParam String email) {
        return accessLogRepository.findByEmail(email.trim().toLowerCase());
    }

    // 7. Admin: Get pending requests
    @GetMapping("/requests")
    public List<StudentRegistration> getPendingRequests() {
        return registrationRepository.findByStatus("PENDING");
    }

    // 8. Admin: Approve student by ID
    @PutMapping("/approve/{id}")
    public ResponseEntity<?> approveStudent(@PathVariable String id) {
        Optional<StudentRegistration> optional = registrationRepository.findById(id);
        if (optional.isPresent()) {
            StudentRegistration reg = optional.get();
            reg.setStatus("APPROVED");
            registrationRepository.save(reg);
            return ResponseEntity.ok("Approved");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not Found");
    }

    @PutMapping("/reject/{id}")
    public ResponseEntity<?> rejectStudent(@PathVariable String id) {
        Optional<StudentRegistration> optional = registrationRepository.findById(id);
        if (optional.isPresent()) {
            StudentRegistration reg = optional.get();
            reg.setStatus("REJECTED");
            registrationRepository.save(reg);
            return ResponseEntity.ok("Rejected");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not Found");
    }
    // StudentController.java
@GetMapping("/registration")
public ResponseEntity<?> getRegistrationByEmail(@RequestParam String email) {
    Optional<StudentRegistration> registration = registrationRepository.findByEmail(email.toLowerCase().trim());
    if (registration.isPresent()) {
        return ResponseEntity.ok(registration.get());
    } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not registered");
    }
}


}
