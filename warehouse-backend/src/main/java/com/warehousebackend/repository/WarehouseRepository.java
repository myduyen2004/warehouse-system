package com.warehousebackend.repository;

import com.warehousebackend.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * @author MyDuyen
 */

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
    List<Warehouse> findByStatus(String status);
    List<Warehouse> findByCity(String city);

    @Query("SELECT w FROM Warehouse w WHERE w.currentUsage < w.capacity")
    List<Warehouse> findAvailableWarehouses();
}
