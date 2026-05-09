package com.procurex.controller;

import com.procurex.entity.Request;
import com.procurex.service.RequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;
import com.procurex.dto.CreateRequestDTO;
import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    private final RequestService requestService;

    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping("/create") // Matches API call in frontend
    @CrossOrigin
    @PreAuthorize("hasRole('RECEIVER')")
    public ResponseEntity<Request> createRequest(@Valid @RequestBody CreateRequestDTO request) {
        Request savedRequest = requestService.createRequest(request);
        return ResponseEntity.ok(savedRequest);
    }

    @GetMapping
    public ResponseEntity<List<Request>> getAll() {
        return ResponseEntity.ok(requestService.getAllRequests());
    }

    @PatchMapping("/{id}/status")
    @CrossOrigin
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Request> updateRequestStatus(@PathVariable Long id, @RequestBody Request requestDetails) {
        return requestService.updateRequestStatus(id, requestDetails.getStatus())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
