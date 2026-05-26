package com.procurex.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @Column(nullable = false, length = 100)
    private String action;

    @Column(nullable = false, length = 50)
    private String module;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    @com.fasterxml.jackson.annotation.JsonIgnore
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    @com.fasterxml.jackson.annotation.JsonProperty("user")
    public String getUserEmail() {
        return user != null ? user.getEmail() : null;
    }
    
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    
    public String getModule() { return module; }
    public void setModule(String module) { this.module = module; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
