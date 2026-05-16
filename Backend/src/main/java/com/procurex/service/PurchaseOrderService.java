package com.procurex.service;

import com.procurex.entity.PurchaseOrder;
import com.procurex.repository.PurchaseOrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final com.procurex.repository.InventoryRepository inventoryRepository;
    private final StockTransactionService stockTransactionService;

    public PurchaseOrderService(PurchaseOrderRepository purchaseOrderRepository,
                                com.procurex.repository.InventoryRepository inventoryRepository,
                                StockTransactionService stockTransactionService) {
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.inventoryRepository = inventoryRepository;
        this.stockTransactionService = stockTransactionService;
    }

    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAll();
    }

    public java.util.Optional<PurchaseOrder> updateStatus(Long id, com.procurex.enums.PurchaseOrderStatus status) {
        return purchaseOrderRepository.findById(id).map(order -> {
            boolean isTerminal = (status == com.procurex.enums.PurchaseOrderStatus.RECEIVED || status == com.procurex.enums.PurchaseOrderStatus.COMPLETED);
            boolean wasTerminal = (order.getStatus() == com.procurex.enums.PurchaseOrderStatus.RECEIVED || order.getStatus() == com.procurex.enums.PurchaseOrderStatus.COMPLETED);
            
            if (isTerminal && !wasTerminal) {
                com.procurex.entity.Inventory inv = order.getInventory();
                inv.setQuantity(inv.getQuantity() + order.getQuantity());
                inventoryRepository.save(inv);
                stockTransactionService.logTransaction(inv, order.getQuantity(), "IN", "PO-" + order.getId());
            }

            order.setStatus(status);
            return purchaseOrderRepository.save(order);
        });
    }
}
