package com.procurex.controller;

import com.procurex.entity.Inventory;
import com.procurex.repository.InventoryRepository;
import com.procurex.service.AuditLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin
public class InventoryController {

    private final InventoryRepository inventoryRepository;
    private final AuditLogService auditLogService;

    public InventoryController(InventoryRepository inventoryRepository, AuditLogService auditLogService) {
        this.inventoryRepository = inventoryRepository;
        this.auditLogService = auditLogService;
    }

    @GetMapping
    public ResponseEntity<List<Inventory>> getAll() {
        return ResponseEntity.ok(inventoryRepository.findAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Inventory> addInventory(@RequestBody Inventory inventory) {
        inventory.recalculateStockLevel();
        Inventory saved = inventoryRepository.save(inventory);
        auditLogService.log("Updated Inventory", "Inventory", "Added inventory item: " + saved.getMaterial());
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROCUREMENT')")
    public ResponseEntity<Inventory> updateInventory(@PathVariable Long id, @RequestBody Inventory details) {
        return inventoryRepository.findById(id).map(existing -> {
            if (details.getMaterial() != null) {
                existing.setMaterial(details.getMaterial());
            }
            if (details.getQuantity() != null) {
                existing.setQuantity(details.getQuantity());
            }
            if (details.getUnit() != null) {
                existing.setUnit(details.getUnit());
            }
            if (details.getPrice() != null) {
                existing.setPrice(details.getPrice());
            }
            if (details.getMinStockLevel() != null) {
                existing.setMinStockLevel(details.getMinStockLevel());
            }
            existing.recalculateStockLevel();
            Inventory saved = inventoryRepository.save(existing);
            auditLogService.log("Updated Inventory", "Inventory", "Updated inventory item: " + saved.getMaterial());
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }
}
