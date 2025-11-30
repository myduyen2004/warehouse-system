package com.warehousebackend.repository;

/**
 * @author MyDuyen
 */

import com.warehousebackend.entity.Shipment;
import com.warehousebackend.entity.ShipmentTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShipmentTrackingRepository extends JpaRepository<ShipmentTracking, Long> {
    List<ShipmentTracking> findByShipmentOrderByTimestampDesc(Shipment shipment);
    List<ShipmentTracking> findTop10ByShipmentOrderByTimestampDesc(Shipment shipment);
}