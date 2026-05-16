package com.procurex.controller;

import com.procurex.entity.Vendor;
import com.procurex.repository.VendorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vendors")
@CrossOrigin
public class VendorController {

    private final VendorRepository vendorRepository;

    public VendorController(VendorRepository vendorRepository) {
        this.vendorRepository = vendorRepository;
    }

    @GetMapping
    public ResponseEntity<List<Vendor>> getAll() {
        return ResponseEntity.ok(vendorRepository.findAll());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PROCUREMENT')")
    public ResponseEntity<Vendor> addVendor(@RequestBody Vendor vendor) {
        return ResponseEntity.ok(vendorRepository.save(vendor));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROCUREMENT')")
    public ResponseEntity<Vendor> updateVendor(@PathVariable Long id, @RequestBody Vendor details) {
        return vendorRepository.findById(id).map(existing -> {
            existing.setName(details.getName());
            existing.setContactName(details.getContactName());
            existing.setEmail(details.getEmail());
            existing.setPhone(details.getPhone());
            return ResponseEntity.ok(vendorRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }
}
