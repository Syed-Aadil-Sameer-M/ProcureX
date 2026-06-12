package com.procurex.service;

import com.procurex.entity.User;
import com.procurex.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditLogService = auditLogService;
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id " + id));
    }

    @Transactional
    public User create(User user) {
        logger.info("Creating new user with username: {}", user.getUsername());
        
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        auditLogService.log("Created User", "Users", "Created user: " + user.getUsername());
        return savedUser;
    }

    @Transactional
    public User update(Long id, User details) {
        logger.info("Updating user with id: {}", id);
        User existing = findById(id);

        if (!existing.getUsername().equals(details.getUsername()) && userRepository.findByUsername(details.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (!existing.getEmail().equals(details.getEmail()) && userRepository.findByEmail(details.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        existing.setUsername(details.getUsername());
        existing.setEmail(details.getEmail());
        existing.setRole(details.getRole());
        existing.setFullName(details.getFullName());
        existing.setDepartment(details.getDepartment());
        existing.setPhoneNumber(details.getPhoneNumber());

        if (details.getPassword() != null && !details.getPassword().isEmpty()) {
            existing.setPassword(passwordEncoder.encode(details.getPassword()));
        }

        User updatedUser = userRepository.save(existing);
        auditLogService.log("Updated User", "Users", "Updated user: " + existing.getUsername());
        return updatedUser;
    }

    @Transactional
    public void delete(Long id) {
        logger.info("Deleting user with id: {}", id);
        User existing = findById(id);
        userRepository.delete(existing);
        auditLogService.log("Deleted User", "Users", "Deleted user: " + existing.getUsername());
    }
}
