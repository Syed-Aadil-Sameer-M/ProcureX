package com.procurex.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.procurex.entity.AuditLog;
import com.procurex.repository.AuditLogRepository;

@RestController
@RequestMapping("/api/audit-logs")
@CrossOrigin
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;

    public AuditLogController(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditLog>> getAll() {
        return ResponseEntity.ok(auditLogRepository.findAllByOrderByTimestampDesc());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AuditLog> getById(@PathVariable Long id) {
        return auditLogRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/module/{module}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditLog>> getByModule(@PathVariable String module) {
        return ResponseEntity.ok(auditLogRepository.findByModuleOrderByTimestampDesc(module));
    }

    @GetMapping("/action/{action}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditLog>> getByAction(@PathVariable String action) {
        return ResponseEntity.ok(auditLogRepository.findByAction(action));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditLog>> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(auditLogRepository.findByUserId(userId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AuditLog> createAuditLog(@RequestBody AuditLog auditLog) {
        return ResponseEntity.ok(auditLogRepository.save(auditLog));
    }
}
