package com.procurex.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.procurex.dto.ForgotPasswordRequest;
import com.procurex.dto.LoginRequest;
import com.procurex.dto.LoginResponse;
import com.procurex.dto.RegisterRequest;
import com.procurex.entity.User;
import com.procurex.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.procurex.security.JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, com.procurex.security.JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail()).orElse(null);

        if (user != null && passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
            return ResponseEntity.ok(new LoginResponse(
                    token,
                    user.getFullName() != null && !user.getFullName().isBlank() ? user.getFullName() : user.getUsername(),
                    user.getRole().name(),
                    user.getId()
            ));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // Bug 11: Duplicate username and email checks
        if (userRepository.findByEmail(request.getEmail()).orElse(null) != null) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        if (userRepository.findByUsername(request.getUsername()).orElse(null) != null) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setFullName(request.getFullName());
        user.setDepartment(request.getDepartment());
        user.setPhoneNumber(request.getPhoneNumber());
        
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        // Mock implementation for now
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user != null) {
            return ResponseEntity.ok("Password reset code sent");
        }
        return ResponseEntity.ok("If the email exists, a reset code will be sent");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // JWT is stateless, so we just return success
        // Client side will clear the token from localStorage
        return ResponseEntity.ok("Logged out successfully");
    }
}
