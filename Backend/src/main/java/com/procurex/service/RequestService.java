package com.procurex.service;

import com.procurex.entity.Request;
import com.procurex.repository.RequestRepository;
import com.procurex.repository.InventoryRepository;
import com.procurex.enums.RequestStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RequestService {

    private final RequestRepository requestRepository;
    private final InventoryRepository inventoryRepository;
    private final StockTransactionService stockTransactionService;

    public RequestService(RequestRepository requestRepository, InventoryRepository inventoryRepository, StockTransactionService stockTransactionService) {
        this.requestRepository = requestRepository;
        this.inventoryRepository = inventoryRepository;
        this.stockTransactionService = stockTransactionService;
    }

    public Request createRequest(com.procurex.dto.CreateRequestDTO dto) {
        Request request = new Request();
        com.procurex.entity.Inventory inventory = inventoryRepository.findByMaterial(dto.getMaterial())
                .orElseGet(() -> {
                    com.procurex.entity.Inventory newInv = new com.procurex.entity.Inventory();
                    newInv.setMaterial(dto.getMaterial());
                    newInv.setQuantity(0);
                    newInv.setUnit("pcs");
                    newInv.setMinStockLevel(10);
                    return inventoryRepository.save(newInv);
                });
        request.setInventory(inventory);
        request.setQuantity(dto.getQuantity());
        request.setLocation(dto.getLocation());
        request.setDescription(dto.getDescription());
        return requestRepository.save(request);
    }

    public List<Request> getAllRequests() {
        return requestRepository.findAll();
    }

    public Optional<Request> updateRequestStatus(Long id, RequestStatus status) {
        return requestRepository.findById(id).map(existingRequest -> {
            // Only deduct inventory if changing TO COMPLETED from a different status
            if (status == RequestStatus.COMPLETED && existingRequest.getStatus() != RequestStatus.COMPLETED) {
                com.procurex.entity.Inventory inv = existingRequest.getInventory();
                inv.setQuantity(inv.getQuantity() - existingRequest.getQuantity());
                inventoryRepository.save(inv);
                stockTransactionService.logTransaction(inv, -existingRequest.getQuantity(), "OUT", "REQ-" + existingRequest.getId());
            }
            existingRequest.setStatus(status);
            return requestRepository.save(existingRequest);
        });
    }
}
