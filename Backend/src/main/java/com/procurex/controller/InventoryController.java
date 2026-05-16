package com.procurex.controller;

import com.procurex.entity.Inventory;
import com.procurex.repository.InventoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin
public class InventoryController {

    private final InventoryRepository inventoryRepository;

    public InventoryController(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    @GetMapping
    public ResponseEntity<List<Inventory>> getAll() {
        return ResponseEntity.ok(inventoryRepository.findAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Inventory> addInventory(@RequestBody Inventory inventory) {
        return ResponseEntity.ok(inventoryRepository.save(inventory));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Inventory> updateInventory(@PathVariable Long id, @RequestBody Inventory details) {
        return inventoryRepository.findById(id).map(existing -> {
            existing.setQuantity(details.getQuantity());
            existing.setPrice(details.getPrice());
            existing.setMinStockLevel(details.getMinStockLevel());
            return ResponseEntity.ok(inventoryRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }
}
