package com.warehousebackend.repository;

import com.warehousebackend.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * @author MyDuyen
 */

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    Optional<Shipment> findByTrackingNumber(String trackingNumber);
    Optional<Shipment> findByOrder(Order order);
    List<Shipment> findByStatus(ShipmentStatus status);
    List<Shipment> findByDriver(User driver);
    List<Shipment> findByVehicle(Vehicle vehicle);

    @Query("SELECT s FROM Shipment s WHERE s.status IN :statuses")
    List<Shipment> findByStatusIn(@Param("statuses") List<ShipmentStatus> statuses);

    @Query("SELECT s FROM Shipment s WHERE s.estimatedDeliveryTime < :now AND s.status NOT IN ('DELIVERED', 'CANCELLED')")
    List<Shipment> findDelayedShipments(@Param("now") LocalDateTime now);
    long countByStatus(String status);

}