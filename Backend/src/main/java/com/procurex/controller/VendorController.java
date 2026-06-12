package com.procurex.controller;

import com.procurex.entity.Vendor;
import com.procurex.service.VendorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vendors")
@CrossOrigin
public class VendorController {

    private final VendorService vendorService;

    public VendorController(VendorService vendorService) {
        this.vendorService = vendorService;
    }

    @GetMapping
    public ResponseEntity<List<Vendor>> getAll() {
        return ResponseEntity.ok(vendorService.findAll());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PROCUREMENT')")
    public ResponseEntity<Vendor> addVendor(@RequestBody Vendor vendor) {
        return ResponseEntity.ok(vendorService.create(vendor));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROCUREMENT')")
    public ResponseEntity<Vendor> updateVendor(@PathVariable Long id, @RequestBody Vendor details) {
        return ResponseEntity.ok(vendorService.update(id, details));
    }
}
