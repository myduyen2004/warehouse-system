package com.warehousebackend.dto.shipment;

/**
 * @author MyDuyen
 */

import com.warehousebackend.entity.Shipment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentResponse {
    private Long id;
    private String trackingNumber;
    private Long orderId;
    private String orderNumber;
    private String status;
    private String vehicleLicensePlate;
    private String driverName;
    private Double currentLatitude;
    private Double currentLongitude;
    private Double currentSpeed;
    private Double distanceTraveled;
    private Double estimatedDistance;
    private LocalDateTime pickupTime;
    private LocalDateTime estimatedDeliveryTime;
    private LocalDateTime actualDeliveryTime;
    private Boolean isDelayed;
    private Long delayMinutes;

    public static ShipmentResponse from(Shipment shipment) {
        return ShipmentResponse.builder()
                .id(shipment.getId())
                .trackingNumber(shipment.getTrackingNumber())
                .orderId(shipment.getOrder().getId())
                .orderNumber(shipment.getOrder().getOrderNumber())
                .status(shipment.getStatus().name())
                .vehicleLicensePlate(shipment.getVehicle() != null ?
                        shipment.getVehicle().getLicensePlate() : null)
                .driverName(shipment.getDriver() != null ?
                        shipment.getDriver().getFullName() : null)
                .currentLatitude(shipment.getCurrentLatitude())
                .currentLongitude(shipment.getCurrentLongitude())
                .currentSpeed(shipment.getCurrentSpeed())
                .distanceTraveled(shipment.getDistanceTraveled())
                .estimatedDistance(shipment.getEstimatedDistance())
                .pickupTime(shipment.getPickupTime())
                .estimatedDeliveryTime(shipment.getEstimatedDeliveryTime())
                .actualDeliveryTime(shipment.getActualDeliveryTime())
                .isDelayed(shipment.isDelayed())
                .delayMinutes(shipment.getDelayMinutes())
                .build();
    }
}