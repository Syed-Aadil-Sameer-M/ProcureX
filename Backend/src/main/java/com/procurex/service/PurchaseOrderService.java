package com.procurex.service;

import com.procurex.entity.PurchaseOrder;
import com.procurex.repository.PurchaseOrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PurchaseOrderService {

    private static final Logger logger = LoggerFactory.getLogger(PurchaseOrderService.class);

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
        logger.debug("Fetching all purchase orders");
        return purchaseOrderRepository.findAll();
    }

    public java.util.Optional<PurchaseOrder> getPurchaseOrderById(Long id) {
        logger.debug("Retrieving purchase order by id={}", id);
        return purchaseOrderRepository.findById(id);
    }

    @org.springframework.transaction.annotation.Transactional
    public java.util.Optional<PurchaseOrder> updateStatus(Long id, com.procurex.enums.PurchaseOrderStatus status) {
        logger.info("Updating purchase order status for id={} to {}", id, status);
        return purchaseOrderRepository.findById(id).map(order -> {
            boolean isTerminal = (status == com.procurex.enums.PurchaseOrderStatus.RECEIVED || status == com.procurex.enums.PurchaseOrderStatus.COMPLETED);
            boolean wasTerminal = (order.getStatus() == com.procurex.enums.PurchaseOrderStatus.RECEIVED || order.getStatus() == com.procurex.enums.PurchaseOrderStatus.COMPLETED);
            
            if (isTerminal && !wasTerminal) {
                com.procurex.entity.Inventory inv = order.getInventory();
                inv.setQuantity(inv.getQuantity() + order.getQuantity());
                inv.recalculateStockLevel();
                inventoryRepository.save(inv);
                stockTransactionService.logTransaction(inv, order.getQuantity(), "IN", "PO-" + order.getId());
            }

            order.setStatus(status);
            return purchaseOrderRepository.save(order);
        });
    }
}
