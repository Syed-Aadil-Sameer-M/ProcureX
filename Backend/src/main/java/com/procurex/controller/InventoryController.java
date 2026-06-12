package com.procurex.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.procurex.entity.Inventory;
import com.procurex.repository.InventoryRepository;
import com.procurex.service.AuditLogService;
import com.procurex.service.StockTransactionService;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin
public class InventoryController {

    private final InventoryRepository inventoryRepository;
    private final AuditLogService auditLogService;
    private final StockTransactionService stockTransactionService;

    public InventoryController(InventoryRepository inventoryRepository, AuditLogService auditLogService,
                               StockTransactionService stockTransactionService) {
        this.inventoryRepository = inventoryRepository;
        this.auditLogService = auditLogService;
        this.stockTransactionService = stockTransactionService;
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
            Integer oldQuantity = existing.getQuantity();

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

            // Bug 9: Log stock transaction if quantity changed
            int quantityDelta = saved.getQuantity() - oldQuantity;
            if (quantityDelta != 0) {
                String type = quantityDelta > 0 ? "IN" : "OUT";
                stockTransactionService.logTransaction(saved, Math.abs(quantityDelta), type, "MANUAL-ADJUST");
            }

            auditLogService.log("Updated Inventory", "Inventory", "Updated inventory item: " + saved.getMaterial());
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }
}
