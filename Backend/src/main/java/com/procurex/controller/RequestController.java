package com.procurex.controller;

import com.procurex.dto.CreateRequestDTO;
import com.procurex.entity.Request;
import com.procurex.enums.RequestStatus;
import com.procurex.service.RequestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin
public class RequestController {

    private final RequestService requestService;

    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('RECEIVER', 'ADMIN')")
    public ResponseEntity<Request> createRequest(@Valid @RequestBody CreateRequestDTO dto) {
        return ResponseEntity.ok(requestService.createRequest(dto));
    }

    @GetMapping
    public ResponseEntity<org.springframework.data.domain.Page<Request>> getAll(
            @RequestParam(required = false) RequestStatus status,
            org.springframework.data.domain.Pageable pageable) {
        return ResponseEntity.ok(requestService.getAllRequests(pageable, status));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('RECEIVER')")
    public ResponseEntity<org.springframework.data.domain.Page<Request>> getMyRequests(org.springframework.data.domain.Pageable pageable) {
        String username = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(requestService.getRequestsByUser(username, pageable));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Request> updateRequestStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> requestDetails) {
        String statusStr = requestDetails.get("status");
        if (statusStr == null) {
            return ResponseEntity.badRequest().build();
        }
        RequestStatus status;
        try {
            status = RequestStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
        return requestService.updateRequestStatus(id, status)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
