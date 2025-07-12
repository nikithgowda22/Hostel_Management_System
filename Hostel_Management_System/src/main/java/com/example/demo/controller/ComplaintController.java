package com.example.demo.controller;

import com.example.demo.model.Complaint;
import com.example.demo.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {

    @Autowired
    private ComplaintRepository complaintRepository;

    @PostMapping("/submit")
    public Complaint submitComplaint(@RequestBody Complaint complaint) {
        complaint.setDate(LocalDate.now().toString());
        return complaintRepository.save(complaint);
    }
}
