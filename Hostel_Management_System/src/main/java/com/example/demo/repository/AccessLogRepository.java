package com.example.demo.repository;

import com.example.demo.model.AccessLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AccessLogRepository extends MongoRepository<AccessLog, String> {
    List<AccessLog> findByEmail(String email);
}
