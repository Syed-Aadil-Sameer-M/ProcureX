package com.procurex.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.procurex.entity.AuditLog;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findAllByOrderByTimestampDesc();
    List<AuditLog> findByModule(String module);
    List<AuditLog> findByAction(String action);
    List<AuditLog> findByUserId(Long userId);
    List<AuditLog> findByModuleOrderByTimestampDesc(String module);
}
