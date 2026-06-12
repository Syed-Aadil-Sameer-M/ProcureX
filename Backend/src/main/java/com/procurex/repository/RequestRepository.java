package com.procurex.repository;

import com.procurex.entity.Request;
import com.procurex.entity.User;
import com.procurex.enums.RequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {

    @Query("SELECT r FROM Request r JOIN FETCH r.inventory JOIN FETCH r.user WHERE r.user = :user")
    Page<Request> findByUserWithDetails(@Param("user") User user, Pageable pageable);

    @Query("SELECT r FROM Request r JOIN FETCH r.inventory JOIN FETCH r.user WHERE r.status = :status")
    Page<Request> findByStatusWithDetails(@Param("status") RequestStatus status, Pageable pageable);

    @Query(value = "SELECT r FROM Request r JOIN FETCH r.inventory JOIN FETCH r.user",
           countQuery = "SELECT count(r) FROM Request r")
    Page<Request> findAllWithDetails(Pageable pageable);
}
