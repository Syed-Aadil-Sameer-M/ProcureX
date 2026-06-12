package com.procurex.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.procurex.entity.Notification;
import com.procurex.entity.Request;
import com.procurex.entity.User;
import com.procurex.enums.RequestStatus;
import com.procurex.repository.InventoryRepository;
import com.procurex.repository.NotificationRepository;
import com.procurex.repository.RequestRepository;
import com.procurex.repository.UserRepository;

@Service
public class RequestService {
    private final UserRepository userRepository;
    private final RequestRepository requestRepository;
    private final InventoryRepository inventoryRepository;
    private final StockTransactionService stockTransactionService;
    private final AuditLogService auditLogService;
    private final NotificationRepository notificationRepository;

    public RequestService(
        RequestRepository requestRepository,
        InventoryRepository inventoryRepository,
        StockTransactionService stockTransactionService,
        UserRepository userRepository,
        AuditLogService auditLogService,
        NotificationRepository notificationRepository
    ) {
        this.requestRepository = requestRepository;
        this.inventoryRepository = inventoryRepository;
        this.stockTransactionService = stockTransactionService;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
        this.notificationRepository = notificationRepository;
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
            RequestStatus currentStatus = existingRequest.getStatus();

            // Bug 6: Prevent workflow bypass — PENDING → COMPLETED is invalid
            if (status == RequestStatus.COMPLETED && currentStatus != RequestStatus.APPROVED) {
                throw new RuntimeException("Only APPROVED requests can be completed");
            }

            if ((status == RequestStatus.APPROVED || status == RequestStatus.REJECTED)
                    && currentStatus != RequestStatus.PENDING) {
                throw new RuntimeException("Only PENDING requests can be approved or rejected");
            }

            // Bug 7: Inventory negative guard — check sufficient stock before deducting
            if (status == RequestStatus.COMPLETED) {
                com.procurex.entity.Inventory inv = existingRequest.getInventory();
                if (inv.getQuantity() < existingRequest.getQuantity()) {
                    throw new RuntimeException("Insufficient inventory: available "
                        + inv.getQuantity() + ", requested " + existingRequest.getQuantity());
                }
                inv.setQuantity(inv.getQuantity() - existingRequest.getQuantity());
                inv.recalculateStockLevel();
                inventoryRepository.save(inv);
                stockTransactionService.logTransaction(inv, -existingRequest.getQuantity(), "OUT", "REQ-" + existingRequest.getId());
            }
            
            existingRequest.setStatus(status);
            Request saved = requestRepository.save(existingRequest);

            // Bug 8: Create notification for the request owner
            User requestOwner = existingRequest.getUser();
            if (requestOwner != null) {
                Notification notification = new Notification();
                notification.setUser(requestOwner);
                notification.setMessage("Your request REQ-" + String.format("%03d", saved.getId())
                    + " (" + existingRequest.getInventory().getMaterial() + ") has been "
                    + status.name().toLowerCase());
                notification.setIsRead(false);
                notification.setTimestamp(LocalDateTime.now());
                notificationRepository.save(notification);
            }

            // Audit logging for all status changes
            if (status == RequestStatus.APPROVED) {
                auditLogService.log("Approved Request", "Requests", "Approved request " + String.format("REQ-%03d", saved.getId()));
            } else if (status == RequestStatus.REJECTED) {
                auditLogService.log("Rejected Request", "Requests", "Rejected request " + String.format("REQ-%03d", saved.getId()));
            } else if (status == RequestStatus.COMPLETED) {
                auditLogService.log("Completed Request", "Requests", "Completed request " + String.format("REQ-%03d", saved.getId()));
            }

            return saved;
        });
    }
}
