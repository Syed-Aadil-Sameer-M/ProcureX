package com.procurex.controller;

import com.procurex.entity.PurchaseOrder;
import com.procurex.service.PurchaseOrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchase-orders")
@CrossOrigin
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    public PurchaseOrderController(PurchaseOrderService purchaseOrderService) {
        this.purchaseOrderService = purchaseOrderService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PROCUREMENT')")
    public ResponseEntity<List<PurchaseOrder>> getAll() {
        return ResponseEntity.ok(purchaseOrderService.getAllPurchaseOrders());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROCUREMENT')")
    public ResponseEntity<PurchaseOrder> updateStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> details) {
        com.procurex.enums.PurchaseOrderStatus status = com.procurex.enums.PurchaseOrderStatus.valueOf(details.get("status").toUpperCase());
        return purchaseOrderService.updateStatus(id, status)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
