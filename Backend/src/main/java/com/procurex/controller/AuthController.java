package com.procurex.controller;

import com.procurex.dto.LoginRequest;
import com.procurex.dto.LoginResponse;
import com.procurex.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // Simplified dummy login for prototype connection test
        User dummyUser = new User();
        dummyUser.setEmail(loginRequest.getEmail());
        dummyUser.setUsername("Admin");

        // Return a fake token to allow the frontend to proceed
        return ResponseEntity.ok(new LoginResponse("dummy-jwt-token-12345", dummyUser.getUsername()));
    }
}
