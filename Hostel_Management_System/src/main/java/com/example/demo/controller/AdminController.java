package com.example.demo.controller;

import com.example.demo.model.LeaveApplication;
import com.example.demo.repository.LeaveApplicationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private LeaveApplicationRepository leaveRepo;

    // 1. Get all leave applications
    @GetMapping("/leaves")
    public List<LeaveApplication> getAllLeaveRequests() {
        return leaveRepo.findAll();
    }

    // 2. Approve leave
    @PutMapping("/leaves/approve/{id}")
    public ResponseEntity<?> approveLeave(@PathVariable String id) {
        return leaveRepo.findById(id).map(leave -> {
            leave.setStatus("APPROVED");
            leaveRepo.save(leave);
            return ResponseEntity.ok("✅ Leave approved");
        }).orElse(ResponseEntity.status(404).body("❌ Leave not found"));
    }

    // 3. Reject leave
    @PutMapping("/leaves/reject/{id}")
    public ResponseEntity<?> rejectLeave(@PathVariable String id) {
        return leaveRepo.findById(id).map(leave -> {
            leave.setStatus("REJECTED");
            leaveRepo.save(leave);
            return ResponseEntity.ok("✅ Leave rejected");
        }).orElse(ResponseEntity.status(404).body("❌ Leave not found"));
    }
}
