package com.procurex.controller;

import com.procurex.dto.LoginRequest;
import com.procurex.dto.LoginResponse;
import com.procurex.dto.RegisterRequest;
import com.procurex.dto.ForgotPasswordRequest;
import com.procurex.entity.User;
import com.procurex.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail());

        if (user != null && passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            // return a fake token but REAL username and real role
            return ResponseEntity.ok(new LoginResponse(
                    "dummy-jwt-token-12345", // We replace this with JWT later
                    user.getUsername(),
                    user.getRole().name()     // send role to frontend
            ));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // Basic duplicate checks
        if (userRepository.findByEmail(request.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setPlaintextPassword(request.getPassword()); // just for dev tracking
        
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        // Mock implementation for now
        User user = userRepository.findByEmail(request.getEmail());
        if (user != null) {
            return ResponseEntity.ok("Password reset code sent");
        }
        return ResponseEntity.ok("If the email exists, a reset code will be sent");
    }
}
