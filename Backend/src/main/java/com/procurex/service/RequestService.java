package com.procurex.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.procurex.entity.Request;
import com.procurex.entity.User;
import com.procurex.enums.RequestStatus;
import com.procurex.repository.InventoryRepository;
import com.procurex.repository.RequestRepository;
import com.procurex.repository.UserRepository;

@Service
public class RequestService {
    private final UserRepository userRepository;
    private final RequestRepository requestRepository;
    private final InventoryRepository inventoryRepository;
    private final StockTransactionService stockTransactionService;
    private final AuditLogService auditLogService;

    public RequestService(
        RequestRepository requestRepository,
        InventoryRepository inventoryRepository,
        StockTransactionService stockTransactionService,
        UserRepository userRepository,
        AuditLogService auditLogService
    ) {
        this.requestRepository = requestRepository;
        this.inventoryRepository = inventoryRepository;
        this.stockTransactionService = stockTransactionService;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public Request createRequest(com.procurex.dto.CreateRequestDTO dto) {
        Request request = new Request();

        com.procurex.entity.Inventory inventory = inventoryRepository
                .findByMaterial(dto.getMaterial())
                .orElseGet(() -> {
                    com.procurex.entity.Inventory newInv = new com.procurex.entity.Inventory();
                    newInv.setMaterial(dto.getMaterial());
                    newInv.setQuantity(0);
                    newInv.setUnit("pcs");
                    newInv.setMinStockLevel(10);
                    newInv.recalculateStockLevel();
                    return inventoryRepository.save(newInv);
                });

        request.setInventory(inventory);
        request.setQuantity(dto.getQuantity());
        request.setLocation(dto.getLocation());
        request.setDescription(dto.getDescription());

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        request.setUser(user);

        Request savedRequest = requestRepository.save(request);
        auditLogService.log("Created Request", "Requests", "Created request for " + savedRequest.getMaterial());
        return savedRequest;
    }

    public List<Request> getAllRequests() {
        return requestRepository.findAll();
    }

    public List<Request> getRequestsByUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return requestRepository.findByUser(user);
    }

    @Transactional
    public Optional<Request> updateRequestStatus(Long id, RequestStatus status) {
        return requestRepository.findById(id).map(existingRequest -> {
            if ((status == RequestStatus.APPROVED || status == RequestStatus.REJECTED) 
                    && existingRequest.getStatus() != RequestStatus.PENDING) {
                throw new RuntimeException("Only PENDING requests can be approved or rejected");
            }

            // Only deduct inventory if changing TO COMPLETED from a different status
            if (status == RequestStatus.COMPLETED && existingRequest.getStatus() != RequestStatus.COMPLETED) {
                com.procurex.entity.Inventory inv = existingRequest.getInventory();
                inv.setQuantity(inv.getQuantity() - existingRequest.getQuantity());
                inv.recalculateStockLevel();
                inventoryRepository.save(inv);
                stockTransactionService.logTransaction(inv, -existingRequest.getQuantity(), "OUT", "REQ-" + existingRequest.getId());
            }
            
            existingRequest.setStatus(status);
            Request saved = requestRepository.save(existingRequest);

            if (status == RequestStatus.APPROVED) {
                auditLogService.log("Approved Request", "Requests", "Approved request " + String.format("REQ-%03d", saved.getId()));
            } else if (status == RequestStatus.REJECTED) {
                auditLogService.log("Rejected Request", "Requests", "Rejected request " + String.format("REQ-%03d", saved.getId()));
            }

            return saved;
        });
    }
}
