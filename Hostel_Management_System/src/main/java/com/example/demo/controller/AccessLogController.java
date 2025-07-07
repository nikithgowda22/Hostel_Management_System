package com.example.demo.controller;
import com.example.demo.model.AccessLog;
import com.example.demo.repository.AccessLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accesslog")
@CrossOrigin(origins = "http://localhost:5173") // optional if already handled globally
public class AccessLogController {

    @Autowired
    private AccessLogRepository accessLogRepository;

    @GetMapping("/{email}")
    public List<AccessLog> getAccessLogsByEmail(@PathVariable String email) {
        return accessLogRepository.findByEmail(email);
    }

    @PostMapping
    public AccessLog logAccess(@RequestBody AccessLog accessLog) {
        return accessLogRepository.save(accessLog);
    }
}
