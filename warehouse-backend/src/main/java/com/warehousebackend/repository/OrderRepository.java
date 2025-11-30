package com.warehousebackend.repository;

import com.warehousebackend.entity.Order;
import com.warehousebackend.entity.OrderStatus;
import com.warehousebackend.entity.User;
import com.warehousebackend.entity.Warehouse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * @author MyDuyen
 */

public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByWarehouse(Warehouse warehouse);
    List<Order> findByCustomer(User customer);

    @Query("SELECT o FROM Order o WHERE o.orderDate BETWEEN :start AND :end")
    List<Order> findByOrderDateBetween(@Param("start") LocalDateTime start,
                                       @Param("end") LocalDateTime end);

    @Query("SELECT o FROM Order o WHERE o.status = :status AND o.orderDate < :date")
    List<Order> findPendingOrdersOlderThan(@Param("status") OrderStatus status,
                                           @Param("date") LocalDateTime date);
    Page<Order> findAll(Pageable pageable);
    List<Order> findAllByOrderByOrderDateDesc(Pageable pageable);
}