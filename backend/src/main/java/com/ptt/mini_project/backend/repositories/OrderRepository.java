package com.ptt.mini_project.backend.repositories;

import com.ptt.mini_project.backend.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findAllByIsFinalizedIsTrue();

    List<Order> findAllByIsCompletedTrue();
}
