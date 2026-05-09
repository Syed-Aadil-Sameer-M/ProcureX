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
    @PreAuthorize("hasRole('RECEIVER')")
    public ResponseEntity<Request> createRequest(@Valid @RequestBody CreateRequestDTO dto) {
        return ResponseEntity.ok(requestService.createRequest(dto));
    }

    @GetMapping
    public ResponseEntity<List<Request>> getAll() {
        return ResponseEntity.ok(requestService.getAllRequests());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Request> updateRequestStatus(@PathVariable Long id, @RequestBody Request requestDetails) {
        return requestService.updateRequestStatus(id, requestDetails.getStatus())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
