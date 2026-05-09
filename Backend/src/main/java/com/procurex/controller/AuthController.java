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
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import com.procurex.security.JwtUtil;
import jakarta.validation.Valid;

import com.procurex.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse response = authService.login(loginRequest);
            if (response != null) {
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        boolean success = authService.register(request);
        if (!success) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        boolean exists = authService.processForgotPassword(request);
        if (exists) {
            return ResponseEntity.ok("Password reset code sent");
        }
        return ResponseEntity.ok("If the email exists, a reset code will be sent");
    }
}
