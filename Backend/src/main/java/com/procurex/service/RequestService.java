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

    public RequestService(RequestRepository requestRepository, InventoryRepository inventoryRepository) {
        this.requestRepository = requestRepository;
        this.inventoryRepository = inventoryRepository;
    }

    public Request createRequest(com.procurex.dto.CreateRequestDTO dto) {
        Request request = new Request();
        com.procurex.entity.Inventory inventory = inventoryRepository.findByMaterial(dto.getMaterial())
                .orElseThrow(() -> new RuntimeException("Material not found in inventory: " + dto.getMaterial()));
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
            existingRequest.setStatus(status);
            return requestRepository.save(existingRequest);
        });
    }
}
