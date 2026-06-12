package com.procurex.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.procurex.entity.Notification;
import com.procurex.entity.Request;
import com.procurex.entity.User;
import com.procurex.enums.RequestStatus;
import com.procurex.repository.InventoryRepository;
import com.procurex.repository.RequestRepository;
import com.procurex.repository.UserRepository;

@Service
public class RequestService {
    private static final Logger logger = LoggerFactory.getLogger(RequestService.class);

    private final UserRepository userRepository;
    private final RequestRepository requestRepository;
    private final InventoryRepository inventoryRepository;
    private final StockTransactionService stockTransactionService;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    public RequestService(
        RequestRepository requestRepository,
        InventoryRepository inventoryRepository,
        StockTransactionService stockTransactionService,
        UserRepository userRepository,
        AuditLogService auditLogService,
        NotificationService notificationService
    ) {
        this.requestRepository = requestRepository;
        this.inventoryRepository = inventoryRepository;
        this.stockTransactionService = stockTransactionService;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
        this.notificationService = notificationService;
    }

    @Transactional
    public Request createRequest(com.procurex.dto.CreateRequestDTO dto) {
        logger.info("Creating request for material={} quantity={} location={}", dto.getMaterial(), dto.getQuantity(), dto.getLocation());
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

    public org.springframework.data.domain.Page<Request> getAllRequests(org.springframework.data.domain.Pageable pageable, RequestStatus status) {
        logger.debug("Retrieving requests with status={}, pageable={}", status, pageable);
        if (status != null) {
            return requestRepository.findByStatusWithDetails(status, pageable);
        }
        return requestRepository.findAllWithDetails(pageable);
    }

    public org.springframework.data.domain.Page<Request> getRequestsByUser(String username, org.springframework.data.domain.Pageable pageable) {
        logger.debug("Retrieving requests for user={}, pageable={}", username, pageable);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return requestRepository.findByUserWithDetails(user, pageable);
    }

    @Transactional
    public Optional<Request> updateRequestStatus(Long id, RequestStatus status) {
        logger.info("Updating request status for id={} to {}", id, status);
        return requestRepository.findById(id).map(existingRequest -> {
            RequestStatus currentStatus = existingRequest.getStatus();

            if (status == RequestStatus.COMPLETED && currentStatus != RequestStatus.APPROVED) {
                logger.warn("Request status transition invalid: current={} target={}", currentStatus, status);
                throw new RuntimeException("Only APPROVED requests can be completed");
            }

            if ((status == RequestStatus.APPROVED || status == RequestStatus.REJECTED)
                    && currentStatus != RequestStatus.PENDING) {
                logger.warn("Request status transition invalid: current={} target={}", currentStatus, status);
                throw new RuntimeException("Only PENDING requests can be approved or rejected");
            }

            if (status == RequestStatus.COMPLETED) {
                com.procurex.entity.Inventory inv = existingRequest.getInventory();
                if (inv.getQuantity() < existingRequest.getQuantity()) {
                    logger.warn("Insufficient inventory: available={} requested={}", inv.getQuantity(), existingRequest.getQuantity());
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

            User requestOwner = existingRequest.getUser();
            if (requestOwner != null) {
                String message = "Your request REQ-" + String.format("%03d", saved.getId())
                    + " (" + existingRequest.getInventory().getMaterial() + ") has been "
                    + status.name().toLowerCase();
                notificationService.createNotification(requestOwner, message, "STATUS_UPDATE");
            }

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
