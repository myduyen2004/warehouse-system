package com.warehousebackend.dto.shipment;

/**
 * @author MyDuyen
 */

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateShipmentDTO {
    @NotNull(message = "Order ID is required")
    private Long orderId;

    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;

    @NotNull(message = "Driver ID is required")
    private Long driverId;

    private Long routeId;
    private LocalDateTime pickupTime;
    private LocalDateTime estimatedDeliveryTime;
    private String notes;
}