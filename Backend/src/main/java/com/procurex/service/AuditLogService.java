package com.procurex.service;

import com.procurex.entity.AuditLog;
import com.procurex.entity.User;
import com.procurex.repository.AuditLogRepository;
import com.procurex.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    public AuditLogService(AuditLogRepository auditLogRepository, UserRepository userRepository) {
        this.auditLogRepository = auditLogRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void log(String action, String module, String description) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = null;
        if (auth != null && auth.isAuthenticated() && !(auth instanceof org.springframework.security.authentication.AnonymousAuthenticationToken)) {
            String username = auth.getName();
            currentUser = userRepository.findByUsername(username).orElse(null);
        }

        AuditLog log = new AuditLog();
        log.setUser(currentUser);
        log.setAction(action);
        log.setModule(module);
        log.setDescription(description);
        auditLogRepository.save(log);
    }
}
