package com.warehousebackend.repository;

import com.warehousebackend.entity.Inventory;
import com.warehousebackend.entity.Product;
import com.warehousebackend.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * @author MyDuyen
 */

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByProductAndWarehouse(Product product, Warehouse warehouse);
    List<Inventory> findByWarehouse(Warehouse warehouse);
    List<Inventory> findByProduct(Product product);

    @Query("SELECT i FROM Inventory i WHERE i.quantity < i.minThreshold")
    List<Inventory> findLowStockItems();

    @Query("SELECT i FROM Inventory i WHERE i.quantity > i.maxThreshold")
    List<Inventory> findOverStockItems();

    @Query("SELECT i FROM Inventory i WHERE i.expiryDate < :date")
    List<Inventory> findExpiringItems(@Param("date") LocalDateTime date);
}