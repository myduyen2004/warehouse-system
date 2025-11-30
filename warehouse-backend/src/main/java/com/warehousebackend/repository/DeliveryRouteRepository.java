package com.warehousebackend.repository;

/**
 * @author MyDuyen
 */

import com.warehousebackend.entity.DeliveryRoute;
import com.warehousebackend.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliveryRouteRepository extends JpaRepository<DeliveryRoute, Long> {
    List<DeliveryRoute> findByStatus(String status);
    List<DeliveryRoute> findByStartWarehouse(Warehouse warehouse);

    @Query("SELECT dr FROM DeliveryRoute dr WHERE dr.status = 'ACTIVE' ORDER BY dr.totalDistance ASC")
    List<DeliveryRoute> findActiveRoutesByDistance();
}