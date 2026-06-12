package com.procurex.repository;

import com.procurex.entity.PurchaseOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    @Query(value = "SELECT p FROM PurchaseOrder p JOIN FETCH p.inventory JOIN FETCH p.vendor",
           countQuery = "SELECT count(p) FROM PurchaseOrder p")
    Page<PurchaseOrder> findAllWithDetails(Pageable pageable);
}
