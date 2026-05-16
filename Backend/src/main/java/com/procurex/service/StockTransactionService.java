package com.procurex.service;

import com.procurex.entity.Inventory;
import com.procurex.entity.StockTransaction;
import com.procurex.repository.StockTransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StockTransactionService {

    private final StockTransactionRepository transactionRepository;

    public StockTransactionService(StockTransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public StockTransaction logTransaction(Inventory inventory, int quantityChange, String type, String reference) {
        StockTransaction tx = new StockTransaction();
        tx.setInventory(inventory);
        tx.setQuantityChange(quantityChange);
        tx.setType(type);
        tx.setReference(reference);
        return transactionRepository.save(tx);
    }
}
