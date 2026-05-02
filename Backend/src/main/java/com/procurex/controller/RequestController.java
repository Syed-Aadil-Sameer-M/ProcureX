package com.procurex.controller;

import com.procurex.entity.Request;
import com.procurex.repository.RequestRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    private final RequestRepository requestRepository;

    public RequestController(RequestRepository requestRepository) {
        this.requestRepository = requestRepository;
    }

    @PostMapping("/create") // Matches API call in frontend
    @CrossOrigin
    public ResponseEntity<Request> createRequest(@RequestBody Request request) {
        Request savedRequest = requestRepository.save(request);
        return ResponseEntity.ok(savedRequest);
    }

    @GetMapping
    public ResponseEntity<List<Request>> getAll() {
        return ResponseEntity.ok(requestRepository.findAll());
    }

    @PutMapping("/{id}")
    @CrossOrigin
    public ResponseEntity<Request> updateRequest(@PathVariable Long id,
                                                 @RequestBody Request requestDetails) {
        return requestRepository.findById(id)
                .map(existingRequest -> {
                    existingRequest.setStatus(requestDetails.getStatus());
                    return ResponseEntity.ok(requestRepository.save(existingRequest));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
