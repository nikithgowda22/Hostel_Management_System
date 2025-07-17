package com.example.demo.controller;

import com.example.demo.model.AccessLog;
import com.example.demo.repository.AccessLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accesslog")
@CrossOrigin(origins = "http://localhost:5173")
public class AccessLogController {

    @Autowired
    private AccessLogRepository accessLogRepository;

    @GetMapping("/{email}")
    public List<AccessLog> getAccessLogsByEmail(@PathVariable String email) {
        return accessLogRepository.findByEmailOrderByTimestampDesc(email); // ✅ FIXED METHOD NAME
    }

    @PostMapping
    public AccessLog logAccess(@RequestBody AccessLog accessLog) {
        AccessLog saved = accessLogRepository.save(accessLog);

        List<AccessLog> logs = accessLogRepository.findByEmailOrderByTimestampDesc(accessLog.getEmail());

        // Keep only the latest 10 entries
        if (logs.size() > 10) {
            List<AccessLog> toDelete = logs.subList(10, logs.size());
            accessLogRepository.deleteAll(toDelete);
        }

        return saved;
    }
}
