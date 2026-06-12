package com.procurex.service;

import com.procurex.entity.Vendor;
import com.procurex.repository.VendorRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class VendorService {

    private static final Logger logger = LoggerFactory.getLogger(VendorService.class);
    private final VendorRepository vendorRepository;
    private final AuditLogService auditLogService;

    public VendorService(VendorRepository vendorRepository, AuditLogService auditLogService) {
        this.vendorRepository = vendorRepository;
        this.auditLogService = auditLogService;
    }

    public List<Vendor> findAll() {
        return vendorRepository.findAll();
    }

    public Vendor findById(Long id) {
        return vendorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vendor with ID " + id + " not found"));
    }

    @Transactional
    public Vendor create(Vendor vendor) {
        logger.info("Creating new vendor: {}", vendor.getName());
        Vendor savedVendor = vendorRepository.save(vendor);
        auditLogService.log("Created Vendor", "Vendors", "Created vendor: " + savedVendor.getName());
        return savedVendor;
    }

    @Transactional
    public Vendor update(Long id, Vendor details) {
        logger.info("Updating vendor with ID: {}", id);
        Vendor existing = findById(id);
        
        existing.setName(details.getName());
        existing.setContactName(details.getContactName());
        existing.setEmail(details.getEmail());
        existing.setPhone(details.getPhone());
        
        Vendor updatedVendor = vendorRepository.save(existing);
        auditLogService.log("Updated Vendor", "Vendors", "Updated vendor: " + updatedVendor.getName());
        return updatedVendor;
    }
}
