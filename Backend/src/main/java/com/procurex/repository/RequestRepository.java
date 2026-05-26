package com.procurex.repository;

import com.procurex.entity.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {
    java.util.List<Request> findByUser(com.procurex.entity.User user);
}
